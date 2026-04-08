import { escapeHtml } from '@/utils/dom'
import { formatCAD, formatDateTime } from '@/utils/format'
import type { Ride } from '@/contracts/types/Ride'

/**
 * Render a ride card HTML string.
 */
export function renderRideCard(ride: Ride): string {
  return `
    <div class="rc" data-id="${ride.id}">
      <div class="trip-card">
        <div class="trow">
          <span class="th3">${escapeHtml(ride.origin)}</span>
          <span class="th4">${formatDateTime(ride.departureAt)}</span>
        </div>
        <div class="trow">
          <span class="th3">${escapeHtml(ride.destination)}</span>
          <span class="th4">${formatCAD(ride.pricePerSeat)} / seat</span>
        </div>
        <div class="statsbar">
          <span class="pill">${ride.seatsAvailable} seat${ride.seatsAvailable !== 1 ? 's' : ''}</span>
          ${ride.driverVerified ? '<span class="pill">✓ Verified</span>' : ''}
        </div>
      </div>
    </div>
  `.trim()
}

/**
 * Mount ride cards into a container element.
 */
export function mountRideCards(container: HTMLElement, rides: Ride[]): void {
  container.innerHTML = rides.map(renderRideCard).join('')
}
