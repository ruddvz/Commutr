import { rideService } from '@/services/rideService'
import { seatRequestService } from '@/services/seatRequestService'
import { authService } from '@/services/authService'
import { appStore } from '@/app/store'
import { go } from '@/utils/router'
import { showToast } from '@/components/toast'
import { escapeHtml } from '@/utils/dom'
import { formatCAD, formatDateTime } from '@/utils/format'

export async function loadRideDetail(): Promise<void> {
  const container = document.getElementById('ride-detail-content')
  const id = appStore.getSelectedRideId()
  if (!container || !id) return

  try {
    const ride = await rideService.getById(id)
    container.innerHTML = `
      <div class="glg" style="padding:16px;border-radius:var(--r4)">
        <h2 class="th2">${escapeHtml(ride.origin)} → ${escapeHtml(ride.destination)}</h2>
        <p class="tb2">${escapeHtml(formatDateTime(ride.departureAt))}</p>
        <p class="th3">${escapeHtml(formatCAD(ride.pricePerSeat))} cost share / seat</p>
        <p class="tb2">${ride.seatsAvailable} of ${ride.seatsTotal} seats available</p>
        <p class="tb2">Driver: ${escapeHtml(ride.driverName)} · ${ride.driverVerified ? 'ID on file' : 'Unverified'}</p>
        <p class="tc2" style="margin-top:12px">No COMMUTR booking fee. Pay the driver directly (cash/e-transfer) unless you arrange otherwise.</p>
      </div>`
  } catch {
    container.innerHTML = '<p class="tb2">Could not load ride.</p>'
  }
}

export async function requestSeatOnDetail(): Promise<void> {
  if (!authService.isAuthenticated()) {
    showToast('Sign in to request a seat')
    go('signup')
    return
  }
  const rideId = appStore.getSelectedRideId()
  if (!rideId) return

  const seats = parseInt(
    (document.getElementById('detail-seats') as HTMLInputElement | null)?.value ?? '1',
    10,
  )

  try {
    await seatRequestService.requestSeat(rideId, seats)
    showToast('Seat request sent — chat opened with driver')
    go('inbox')
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Request failed')
  }
}
