import { z } from 'zod'

export const createSeatRequestSchema = z.object({
  requestedSeats: z.number().int().min(1).max(8),
})

export const seatRequestActionSchema = z.object({
  totalCostShare: z.number().min(0).optional(),
})
