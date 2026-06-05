import { rideService } from '@/services/rideService'
import { authService } from '@/services/authService'
import { go } from '@/utils/router'
import { showToast } from '@/components/toast'
import {
  estimateDistanceKm,
  suggestPricePerSeat,
  validatePricePerSeat,
} from '@/utils/priceGuardrails'

export async function submitPostRide(): Promise<void> {
  if (!authService.isAuthenticated()) {
    showToast('Sign in to post a ride')
    go('signup')
    return
  }

  const attestation = (document.getElementById('post-attestation') as HTMLInputElement | null)
    ?.checked
  if (!attestation) {
    showToast('Confirm cost-sharing attestation')
    return
  }

  const origin = (document.getElementById('post-origin') as HTMLInputElement | null)?.value.trim()
  const destination = (
    document.getElementById('post-destination') as HTMLInputElement | null
  )?.value.trim()
  const date = (document.getElementById('post-date') as HTMLInputElement | null)?.value
  const time = (document.getElementById('post-departure') as HTMLInputElement | null)?.value
  const seatsTotal = parseInt(
    (document.getElementById('post-seats') as HTMLInputElement | null)?.value ?? '1',
    10,
  )
  const pricePerSeat = parseFloat(
    (document.getElementById('post-price') as HTMLInputElement | null)?.value ?? '0',
  )

  if (!origin || !destination || !date || !time) {
    showToast('Fill route, date, and departure time')
    return
  }

  const departureAt = `${date}T${time}`

  const distanceKm = estimateDistanceKm(origin, destination)
  const priceCheck = validatePricePerSeat(pricePerSeat, distanceKm)
  if (!priceCheck.ok) {
    showToast(priceCheck.warning ?? 'Invalid price')
    return
  }
  if (priceCheck.warning) {
    showToast(priceCheck.warning)
  }

  const suggested = document.getElementById('post-suggested-price')
  if (suggested) {
    suggested.textContent = `Suggested cost share: $${suggestPricePerSeat(distanceKm, seatsTotal).toFixed(2)}/seat`
  }

  try {
    const isoDeparture = new Date(departureAt).toISOString()
    await rideService.create({
      origin,
      destination,
      departureAt: isoDeparture,
      pricePerSeat,
      seatsTotal,
      stops: [],
      amenities: [],
    })
    showToast('Ride posted')
    go('dashboard')
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Could not post ride')
  }
}
