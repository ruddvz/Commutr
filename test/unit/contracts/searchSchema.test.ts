import { describe, it, expect } from 'vitest'
import { searchSchema } from '@/contracts/schemas/rideSchema'

describe('searchSchema', () => {
  it('coerces seats from query strings', () => {
    const result = searchSchema.safeParse({ seats: '2' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.seats).toBe(2)
    }
  })

  it('rejects invalid seats', () => {
    const result = searchSchema.safeParse({ seats: 'x' })
    expect(result.success).toBe(false)
  })

  it('allows empty search', () => {
    const result = searchSchema.safeParse({})
    expect(result.success).toBe(true)
  })
})
