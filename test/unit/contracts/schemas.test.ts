import { describe, it, expect } from 'vitest'
import { rideSchema, searchSchema } from '@/contracts/schemas/rideSchema'
import { registerSchema, loginSchema } from '@/contracts/schemas/userSchema'

describe('rideSchema', () => {
  const validRide = {
    origin: 'Toronto',
    destination: 'Montreal',
    departureAt: '2025-08-01T09:00:00.000Z',
    pricePerSeat: 45,
    seatsTotal: 3,
  }

  it('accepts a valid ride', () => {
    expect(rideSchema.safeParse(validRide).success).toBe(true)
  })

  it('rejects a ride with no origin', () => {
    const { success } = rideSchema.safeParse({ ...validRide, origin: '' })
    expect(success).toBe(false)
  })

  it('rejects a negative price', () => {
    const { success } = rideSchema.safeParse({ ...validRide, pricePerSeat: -5 })
    expect(success).toBe(false)
  })

  it('defaults stops and amenities to empty arrays', () => {
    const result = rideSchema.safeParse(validRide)
    expect(result.success && result.data.stops).toEqual([])
    expect(result.success && result.data.amenities).toEqual([])
  })
})

describe('registerSchema', () => {
  it('rejects a password shorter than 8 chars', () => {
    const { success } = registerSchema.safeParse({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'short',
    })
    expect(success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const { success } = registerSchema.safeParse({
      name: 'Alice',
      email: 'not-an-email',
      password: 'password123',
    })
    expect(success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    expect(
      loginSchema.safeParse({ email: 'a@b.com', password: 'password123' }).success,
    ).toBe(true)
  })
})
