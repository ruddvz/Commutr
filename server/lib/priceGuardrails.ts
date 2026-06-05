const MAX_PRICE_PER_SEAT = 150

export function estimateDistanceKm(origin: string, destination: string): number {
  const pair = `${origin.toLowerCase()}|${destination.toLowerCase()}`
  const known: Record<string, number> = {
    'london, on|toronto, on': 190,
    'toronto, on|ottawa, on': 450,
  }
  return known[pair] ?? 200
}

export function validatePricePerSeat(
  pricePerSeat: number,
  distanceKm: number,
): { ok: boolean; warning?: string } {
  if (pricePerSeat < 0) return { ok: false, warning: 'Price cannot be negative.' }
  if (pricePerSeat > MAX_PRICE_PER_SEAT) {
    return { ok: false, warning: `Cost share cannot exceed $${MAX_PRICE_PER_SEAT} per seat.` }
  }
  if (pricePerSeat > distanceKm * 0.35) {
    return {
      ok: true,
      warning: 'Price is high for typical cost-sharing — ensure this covers fuel/tolls only.',
    }
  }
  return { ok: true }
}
