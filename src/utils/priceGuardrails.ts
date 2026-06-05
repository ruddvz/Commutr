/** Cost-share price helpers — not legal advice; drivers attest to cost-sharing. */

const MAX_PRICE_PER_SEAT = 150
const WARN_RATIO_PER_KM = 0.35

export function estimateDistanceKm(origin: string, destination: string): number {
  const pair = `${origin.toLowerCase()}|${destination.toLowerCase()}`
  const known: Record<string, number> = {
    'london, on|toronto, on': 190,
    'toronto, on|ottawa, on': 450,
    'toronto, on|montreal, qc': 540,
    'vancouver, bc|victoria, bc': 115,
    'calgary, ab|edmonton, ab': 300,
  }
  return known[pair] ?? 200
}

export function suggestPricePerSeat(distanceKm: number, seatsTotal: number): number {
  const fuelEstimate = distanceKm * 0.12
  const tollsParking = distanceKm > 300 ? 25 : 10
  const total = fuelEstimate + tollsParking
  const perSeat = total / Math.max(seatsTotal, 1)
  return Math.round(perSeat * 100) / 100
}

export function validatePricePerSeat(
  pricePerSeat: number,
  distanceKm: number,
): { ok: boolean; warning?: string } {
  if (pricePerSeat < 0) {
    return { ok: false, warning: 'Price cannot be negative.' }
  }
  if (pricePerSeat > MAX_PRICE_PER_SEAT) {
    return {
      ok: false,
      warning: `Cost share above $${MAX_PRICE_PER_SEAT}/seat may look like profit-making. Lower the price or explain tolls/fuel.`,
    }
  }
  const suggested = suggestPricePerSeat(distanceKm, 1)
  if (pricePerSeat > suggested * 2.5 || pricePerSeat > distanceKm * WARN_RATIO_PER_KM) {
    return {
      ok: true,
      warning:
        'This cost share is higher than typical fuel/toll estimates. COMMUTR does not process payments — ensure contributions stay cost-sharing only.',
    }
  }
  return { ok: true }
}
