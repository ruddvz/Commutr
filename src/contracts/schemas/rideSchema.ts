import { z } from 'zod'

export const rideSchema = z.object({
  origin: z.string().min(2).max(100),
  destination: z.string().min(2).max(100),
  departureAt: z.string().datetime(),
  pricePerSeat: z.number().min(0).max(500),
  seatsTotal: z.number().int().min(1).max(8),
  stops: z.array(z.string().max(100)).max(5).default([]),
  notes: z.string().max(500).optional(),
  amenities: z.array(z.string()).max(10).default([]),
})

export const searchSchema = z.object({
  origin: z.string().min(2).max(100).optional(),
  destination: z.string().min(2).max(100).optional(),
  date: z.string().optional(),
  seats: z.coerce.number().int().min(1).max(8).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
})

export type RideInput = z.infer<typeof rideSchema>
export type SearchInput = z.infer<typeof searchSchema>
