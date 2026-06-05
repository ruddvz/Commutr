import { rideService } from '@/services/rideService'
import { seatRequestService } from '@/services/seatRequestService'
import { authService } from '@/services/authService'
import { appStore } from '@/app/store'
import { go } from '@/utils/router'
import { showToast } from '@/components/toast'
import { renderButton } from '@/components/Button'
import { renderBadge } from '@/components/Badge'
import { renderAvatar } from '@/components/Avatar'
import { renderRouteTimeline } from '@/components/RouteTimeline'
import { renderInputField } from '@/components/InputField'
import { openBottomSheet, closeBottomSheet } from '@/components/BottomSheet'
import { mountTopBar } from '@/components/TopBar'
import { renderStickyActions } from '@/components/AppShell'
import { isStaticDemo } from '@/config/runtime'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import { escapeHtml } from '@/utils/dom'
import { formatCAD, formatDateTime } from '@/utils/format'
import type { Ride } from '@/contracts/types/Ride'

export function renderRideDetailScreen({ container }: ScreenRenderContext): void {
  mountTopBar({
    title: 'Ride details',
    showBack: true,
    backGo: 'search',
    actions: `<button type="button" class="cm-icon-button" aria-label="Share ride">↗</button>`,
  })

  container.className = 'cm-screen'
  container.innerHTML = `
    <div id="ride-detail-content">
      ${showLoadingHtml('Loading ride…')}
    </div>
    ${renderStickyActions(renderButton('Message driver', { variant: 'primary', block: true, action: 'request-seat' }))}`

  void loadRideDetail()
}

function showLoadingHtml(msg: string): string {
  return `<div class="cm-empty" role="status"><div class="cm-spinner"></div><p>${escapeHtml(msg)}</p></div>`
}

function renderDetail(ride: Ride): string {
  const badges = [
    ride.driverVerified
      ? renderBadge('ID verified', 'success')
      : renderBadge('Unverified', 'warning'),
    renderBadge('Phone verified', 'brand'),
    renderBadge(`${ride.seatsAvailable} seats left`, 'brand'),
  ].join('')

  return `
    <div class="cm-stack cm-stack--lg">
      <section class="cm-card cm-detail-hero">
        <div class="cm-row cm-row--between">
          <div class="cm-row">
            ${renderAvatar(ride.driverName, { size: 'lg' })}
            <div>
              <h2 class="cm-title-md">${escapeHtml(ride.driverName)}</h2>
              <p class="cm-caption cm-muted">★ ${ride.driverRating.toFixed(1)} · Member since 2024</p>
            </div>
          </div>
          <div class="cm-ride-card__price">${escapeHtml(formatCAD(ride.pricePerSeat))}<span class="cm-ride-card__price-unit"> / seat</span></div>
        </div>
      </section>

      <section class="cm-card cm-card--pad">
        <h3 class="cm-section-title">Route</h3>
        ${renderRouteTimeline({ origin: ride.origin, destination: ride.destination, departureAt: ride.departureAt })}
        <p class="cm-caption cm-muted cm-mt-4">${escapeHtml(formatDateTime(ride.departureAt))}</p>
      </section>

      <section class="cm-card cm-card--pad">
        <h3 class="cm-section-title">Preferences</h3>
        <div class="cm-chip-row">${badges}</div>
        ${ride.notes ? `<p class="cm-body cm-mt-4">${escapeHtml(ride.notes)}</p>` : ''}
      </section>

      <section class="cm-trust-panel">
        <h3 class="cm-title-md">Trust & safety</h3>
        <p class="cm-body cm-muted cm-mt-2">ID verified · Safety tools available after seat confirmation.</p>
        <p class="cm-caption cm-mt-4">COMMUTR charges no booking fee. Agree on payment directly with the driver.</p>
      </section>

      ${renderInputField({ id: 'detail-seats', label: 'Seats requested', type: 'number', value: '1', min: '1', max: String(ride.seatsAvailable) })}
    </div>`
}

export async function loadRideDetail(): Promise<void> {
  const container = document.getElementById('ride-detail-content')
  const id = appStore.getSelectedRideId()
  if (!container || !id) {
    if (container) container.innerHTML = '<p class="cm-body">Select a ride from search.</p>'
    return
  }

  container.innerHTML = showLoadingHtml('Loading ride…')

  try {
    const ride = await rideService.getById(id)
    container.innerHTML = renderDetail(ride)
    const topbar = document.getElementById('appTopBar')
    const title = topbar?.querySelector('.cm-topbar__title')
    if (title)
      title.textContent = `${ride.origin.split(',')[0]} → ${ride.destination.split(',')[0]}`
  } catch {
    container.innerHTML = `
      <div class="cm-card cm-reconnect-card" role="status">
        <p class="cm-reconnect-card__title">Ride not found</p>
        <p class="cm-body cm-muted cm-mt-2">This ride may have been removed. Browse available routes instead.</p>
        <div class="cm-mt-4">${renderButton('Search rides', { variant: 'primary', go: 'search' })}</div>
      </div>`
  }
}

export async function requestSeatOnDetail(): Promise<void> {
  if (!authService.isAuthenticated() && !isStaticDemo) {
    showToast('Sign in to request a seat')
    go('signup')
    return
  }
  const rideId = appStore.getSelectedRideId()
  if (!rideId) return

  openBottomSheet(
    'Request seat',
    `
      <p class="cm-body cm-muted">Send a seat request with pickup notes. The driver will respond in chat.</p>
      ${renderInputField({ id: 'request-seats', label: 'Seats', type: 'number', value: '1', min: '1' })}
      ${renderInputField({ id: 'request-pickup-note', label: 'Pickup note', placeholder: 'Near the main entrance' })}
      <p class="cm-caption cm-muted cm-mt-4">No COMMUTR booking fee. Pay the driver directly after confirmation.</p>
    `,
    renderButton('Send request', {
      variant: 'primary',
      block: true,
      action: 'confirm-seat-request',
    }),
  )

  document.querySelector('[data-action="confirm-seat-request"]')?.addEventListener('click', () => {
    void confirmSeatRequest(rideId)
  })
}

async function confirmSeatRequest(rideId: string): Promise<void> {
  const seats = parseInt(
    (document.getElementById('request-seats') as HTMLInputElement | null)?.value ?? '1',
    10,
  )
  try {
    await seatRequestService.requestSeat(rideId, seats)
    closeBottomSheet()
    showToast('Request sent — chat opened with driver')
    go('inbox')
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Request failed')
  }
}
