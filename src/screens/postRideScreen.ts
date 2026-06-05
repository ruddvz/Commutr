import { rideService } from '@/services/rideService'
import { authService } from '@/services/authService'
import { isStaticDemo } from '@/config/runtime'
import { appStore } from '@/app/store'
import { go } from '@/utils/router'
import { showToast } from '@/components/toast'
import { renderButton } from '@/components/Button'
import { renderInputField } from '@/components/InputField'
import { renderChip, renderChipRow } from '@/components/Chip'
import { renderRideCard } from '@/components/RideCard'
import { mountTopBar } from '@/components/TopBar'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import {
  estimateDistanceKm,
  suggestPricePerSeat,
  validatePricePerSeat,
} from '@/utils/priceGuardrails'
import type { Ride } from '@/contracts/types/Ride'

const STEPS = ['Route', 'Schedule', 'Seats & price', 'Preferences', 'Preview'] as const
type Step = (typeof STEPS)[number]

interface PostDraft {
  origin: string
  destination: string
  pickupSpot: string
  dropoffSpot: string
  date: string
  time: string
  recurring: boolean
  seatsTotal: number
  pricePerSeat: number
  preferences: string[]
  attestation: boolean
}

const defaultDraft = (): PostDraft => ({
  origin: '',
  destination: '',
  pickupSpot: '',
  dropoffSpot: '',
  date: new Date().toISOString().slice(0, 10),
  time: '08:00',
  recurring: false,
  seatsTotal: 3,
  pricePerSeat: 25,
  preferences: [],
  attestation: false,
})

let stepIndex = 0
let draft: PostDraft = defaultDraft()
let showSuccess = false
let lastPostedRide: Ride | null = null

function stepperHtml(): string {
  return `<div class="cm-stepper" aria-hidden="true">${STEPS.map((_, i) => {
    const cls =
      i < stepIndex
        ? 'cm-stepper__dot cm-stepper__dot--done'
        : i === stepIndex
          ? 'cm-stepper__dot cm-stepper__dot--active'
          : 'cm-stepper__dot'
    return `<div class="${cls}"></div>`
  }).join('')}</div>`
}

function preferenceChips(): string {
  const prefs = [
    'No smoking',
    'Pets OK',
    'Music OK',
    'Small luggage',
    'Women-preferred',
    'Quiet ride',
  ]
  return renderChipRow(
    prefs
      .map((p) =>
        renderChip(p, {
          pressed: draft.preferences.includes(p),
          action: 'toggle-pref',
          value: p,
        }),
      )
      .join(''),
  )
}

function stepContent(): string {
  const step = STEPS[stepIndex] as Step
  switch (step) {
    case 'Route':
      return `
        ${renderInputField({ id: 'post-origin', label: 'From city', value: draft.origin, placeholder: 'London, ON' })}
        ${renderInputField({ id: 'post-pickup', label: 'Pickup spot', value: draft.pickupSpot, placeholder: 'Masonville Mall' })}
        ${renderInputField({ id: 'post-destination', label: 'To city', value: draft.destination, placeholder: 'Toronto, ON' })}
        ${renderInputField({ id: 'post-dropoff', label: 'Dropoff spot', value: draft.dropoffSpot, placeholder: 'Union Station' })}
        ${renderButton('Swap route', { variant: 'tertiary', action: 'swap-route' })}`
    case 'Schedule':
      return `
        ${renderInputField({ id: 'post-date', label: 'Date', type: 'date', value: draft.date })}
        ${renderInputField({ id: 'post-departure', label: 'Departure time', type: 'time', value: draft.time })}
        ${renderChipRow(renderChip('Repeat weekly', { pressed: draft.recurring, action: 'toggle-recurring' }))}`
    case 'Seats & price':
      return `
        ${renderInputField({ id: 'post-seats', label: 'Seats available', type: 'number', value: String(draft.seatsTotal), min: '1', max: '6' })}
        ${renderInputField({ id: 'post-price', label: 'Cost-share per seat (CAD)', type: 'number', value: String(draft.pricePerSeat), min: '1' })}
        <div class="cm-price-guardrail" id="post-suggested-price">Keep this as cost-share, not a commercial fare.</div>`
    case 'Preferences':
      return preferenceChips()
    case 'Preview':
      return `
        <p class="cm-body cm-muted">Passengers will see your ride like this:</p>
        <div class="cm-post-preview" id="post-preview-card"></div>
        <label class="cm-row cm-mt-4">
          <input type="checkbox" id="post-attestation" ${draft.attestation ? 'checked' : ''} />
          <span class="cm-caption">I confirm this is cost-sharing, not commercial transport.</span>
        </label>`
    default:
      return ''
  }
}

function readDraftFromDom(): void {
  draft.origin =
    (document.getElementById('post-origin') as HTMLInputElement | null)?.value.trim() ??
    draft.origin
  draft.destination =
    (document.getElementById('post-destination') as HTMLInputElement | null)?.value.trim() ??
    draft.destination
  draft.pickupSpot =
    (document.getElementById('post-pickup') as HTMLInputElement | null)?.value.trim() ??
    draft.pickupSpot
  draft.dropoffSpot =
    (document.getElementById('post-dropoff') as HTMLInputElement | null)?.value.trim() ??
    draft.dropoffSpot
  draft.date =
    (document.getElementById('post-date') as HTMLInputElement | null)?.value ?? draft.date
  draft.time =
    (document.getElementById('post-departure') as HTMLInputElement | null)?.value ?? draft.time
  draft.seatsTotal = parseInt(
    (document.getElementById('post-seats') as HTMLInputElement | null)?.value ??
      String(draft.seatsTotal),
    10,
  )
  draft.pricePerSeat = parseFloat(
    (document.getElementById('post-price') as HTMLInputElement | null)?.value ??
      String(draft.pricePerSeat),
  )
  draft.attestation =
    (document.getElementById('post-attestation') as HTMLInputElement | null)?.checked ??
    draft.attestation
}

function previewRide(): Ride {
  return {
    id: 'preview',
    driverId: 'me',
    driverName: 'You',
    driverVerified: true,
    driverRating: 5,
    origin: draft.origin || 'London, ON',
    destination: draft.destination || 'Toronto, ON',
    departureAt: new Date(`${draft.date}T${draft.time}`).toISOString(),
    pricePerSeat: draft.pricePerSeat,
    seatsAvailable: draft.seatsTotal,
    seatsTotal: draft.seatsTotal,
    stops: [],
    amenities: draft.preferences.map((p) => p.toLowerCase()),
    status: 'active',
    createdAt: new Date().toISOString(),
  }
}

export function renderPostRideScreen({ container }: ScreenRenderContext): void {
  if (showSuccess && lastPostedRide) {
    renderPostSuccessScreen({ container }, lastPostedRide)
    return
  }

  mountTopBar({
    title: 'Post a ride',
    subtitle: `Step ${stepIndex + 1} of ${STEPS.length} · ${STEPS[stepIndex]}`,
    showBack: true,
    backGo: stepIndex > 0 ? undefined : 'home',
  })

  container.className = 'cm-screen cm-screen--full'
  container.innerHTML = `
    <div class="cm-stack cm-stack--lg">
      ${stepperHtml()}
      <div class="cm-card cm-form-card cm-stack" id="post-step-content">${stepContent()}</div>
      <div class="cm-row cm-gap-2">
        ${stepIndex > 0 ? renderButton('Back', { variant: 'outline', action: 'post-back' }) : ''}
        ${stepIndex < STEPS.length - 1 ? renderButton('Next', { variant: 'primary', action: 'post-next', block: true }) : renderButton('Publish ride', { variant: 'primary', action: 'post-submit', block: true })}
      </div>
    </div>`

  bindPostEvents(container)
  if (STEPS[stepIndex] === 'Preview') {
    const preview = container.querySelector('#post-preview-card')
    if (preview)
      preview.innerHTML = renderRideCard({
        ride: previewRide(),
        context: 'profile',
        primaryAction: 'details',
      })
  }
  if (STEPS[stepIndex] === 'Seats & price') {
    updatePriceGuardrail()
  }
}

function bindPostEvents(container: HTMLElement): void {
  container.querySelector('[data-action="post-next"]')?.addEventListener('click', () => {
    readDraftFromDom()
    if (stepIndex < STEPS.length - 1) {
      stepIndex++
      renderPostRideScreen({ container })
    }
  })

  container.querySelector('[data-action="post-back"]')?.addEventListener('click', () => {
    readDraftFromDom()
    if (stepIndex > 0) {
      stepIndex--
      renderPostRideScreen({ container })
    }
  })

  container.querySelector('[data-action="swap-route"]')?.addEventListener('click', () => {
    readDraftFromDom()
    ;[draft.origin, draft.destination] = [draft.destination, draft.origin]
    ;[draft.pickupSpot, draft.dropoffSpot] = [draft.dropoffSpot, draft.pickupSpot]
    renderPostRideScreen({ container })
  })

  container.querySelector('[data-action="toggle-recurring"]')?.addEventListener('click', () => {
    draft.recurring = !draft.recurring
    renderPostRideScreen({ container })
  })

  container.querySelectorAll('[data-action="toggle-pref"]').forEach((el) => {
    el.addEventListener('click', () => {
      const val = (el as HTMLElement).dataset['chipValue'] ?? ''
      if (draft.preferences.includes(val)) {
        draft.preferences = draft.preferences.filter((p) => p !== val)
      } else {
        draft.preferences.push(val)
      }
      renderPostRideScreen({ container })
    })
  })
}

function updatePriceGuardrail(): void {
  const el = document.getElementById('post-suggested-price')
  if (!el) return
  const distanceKm = estimateDistanceKm(draft.origin, draft.destination)
  const suggested = suggestPricePerSeat(distanceKm, draft.seatsTotal)
  el.textContent = `Suggested cost share: $${suggested.toFixed(2)}/seat. Keep this as cost-share, not a commercial fare.`
}

export async function submitPostRide(): Promise<void> {
  readDraftFromDom()
  if (!authService.isAuthenticated() && !isStaticDemo) {
    showToast('Sign in to post a ride')
    go('signup')
    return
  }
  if (!draft.attestation) {
    showToast('Confirm cost-sharing attestation')
    return
  }
  if (!draft.origin || !draft.destination || !draft.date || !draft.time) {
    showToast('Fill route, date, and departure time')
    return
  }

  const distanceKm = estimateDistanceKm(draft.origin, draft.destination)
  const priceCheck = validatePricePerSeat(draft.pricePerSeat, distanceKm)
  if (!priceCheck.ok) {
    showToast(priceCheck.warning ?? 'Invalid price')
    return
  }
  if (priceCheck.warning) showToast(priceCheck.warning)

  try {
    const isoDeparture = new Date(`${draft.date}T${draft.time}`).toISOString()
    const ride = await rideService.create({
      origin: draft.origin,
      destination: draft.destination,
      departureAt: isoDeparture,
      pricePerSeat: draft.pricePerSeat,
      seatsTotal: draft.seatsTotal,
      stops: draft.pickupSpot ? [draft.pickupSpot, draft.dropoffSpot].filter(Boolean) : [],
      notes: draft.pickupSpot ? `${draft.pickupSpot} → ${draft.dropoffSpot}` : undefined,
      amenities: draft.preferences,
    })
    lastPostedRide = ride
    showSuccess = true
    stepIndex = 0
    draft = defaultDraft()
    const el = document.getElementById('appScreen')
    if (el) renderPostRideScreen({ container: el })
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Could not post ride')
  }
}

function renderPostSuccessScreen({ container }: ScreenRenderContext, ride: Ride): void {
  mountTopBar({ title: 'Ride posted', showBack: true, backGo: 'home' })
  const when = new Date(ride.departureAt).toLocaleString('en-CA', {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })

  container.className = 'cm-screen'
  container.innerHTML = `
    <div class="cm-card cm-reconnect-card cm-stack">
      <p class="cm-reconnect-card__title">Ride posted</p>
      <p class="cm-title-md cm-mt-2">${escapeHtml(ride.origin.split(',')[0] ?? ride.origin)} → ${escapeHtml(ride.destination.split(',')[0] ?? ride.destination)}</p>
      <p class="cm-body cm-muted">${escapeHtml(when)} · ${ride.seatsTotal} seats · ${escapeHtml(formatPrice(ride.pricePerSeat))}</p>
      <div class="cm-stack cm-mt-4">
        ${renderButton('View on dashboard', { variant: 'primary', block: true, go: 'dashboard' })}
        ${renderButton('Share ride', { variant: 'secondary', block: true, action: 'share-posted-ride' })}
        ${renderButton('Post another', { variant: 'tertiary', block: true, action: 'post-another' })}
      </div>
    </div>`

  container.querySelector('[data-action="post-another"]')?.addEventListener('click', () => {
    showSuccess = false
    lastPostedRide = null
    renderPostRideScreen({ container })
  })

  container.querySelector('[data-action="share-posted-ride"]')?.addEventListener('click', () => {
    const text = `${ride.origin} → ${ride.destination} on Commutr`
    if (navigator.share) {
      void navigator
        .share({ title: 'Commutr ride', text })
        .catch(() => showToast('Share cancelled'))
    } else {
      void navigator.clipboard.writeText(text).then(() => showToast('Route copied to clipboard'))
    }
  })

  appStore.setSelectedRideId(ride.id)
}

function formatPrice(n: number): string {
  return `$${Number.isInteger(n) ? n : n.toFixed(2)}`
}

function escapeHtml(text: string): string {
  const el = document.createElement('span')
  el.textContent = text
  return el.innerHTML
}

export function resetPostFlow(): void {
  stepIndex = 0
  draft = defaultDraft()
  showSuccess = false
  lastPostedRide = null
}
