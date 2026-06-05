import { rideService } from '@/services/rideService'
import { authService } from '@/services/authService'
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
  if (!authService.isAuthenticated()) {
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
    await rideService.create({
      origin: draft.origin,
      destination: draft.destination,
      departureAt: isoDeparture,
      pricePerSeat: draft.pricePerSeat,
      seatsTotal: draft.seatsTotal,
      stops: draft.pickupSpot ? [draft.pickupSpot] : [],
      amenities: draft.preferences,
    })
    showToast('Ride published')
    stepIndex = 0
    draft = defaultDraft()
    go('dashboard')
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Could not post ride')
  }
}

export function resetPostFlow(): void {
  stepIndex = 0
  draft = defaultDraft()
}
