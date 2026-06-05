import { describe, it, expect } from 'vitest'
import { suggestPricePerSeat, validatePricePerSeat } from '@/utils/priceGuardrails'

describe('priceGuardrails', () => {
  it('suggests a reasonable per-seat amount', () => {
    const price = suggestPricePerSeat(200, 3)
    expect(price).toBeGreaterThan(0)
    expect(price).toBeLessThan(100)
  })

  it('rejects extreme prices', () => {
    const result = validatePricePerSeat(200, 100)
    expect(result.ok).toBe(false)
  })
})
