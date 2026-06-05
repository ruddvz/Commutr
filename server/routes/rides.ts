import { Router } from 'express'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import { AppError } from '../middleware/errorHandler.js'
import { rideSchema, searchSchema } from '../../src/contracts/schemas/rideSchema.js'
import { rideRepository } from '../repositories/rideRepository.js'
import { prisma } from '../db/client.js'
import { createSeatRequestSchema } from '../../src/contracts/schemas/seatRequestSchema.js'
import { createSeatRequestForRide } from './seatRequests.js'
import { estimateDistanceKm, validatePricePerSeat } from '../lib/priceGuardrails.js'

export const ridesRouter = Router()

const FREE_POSTS_PER_MONTH = 3

ridesRouter.get('/', validateQuery(searchSchema), async (req: AuthRequest, res, next) => {
  try {
    const query = (req.validatedQuery ?? {}) as {
      origin?: string
      destination?: string
      date?: string
      seats?: number
      maxPrice?: number
    }
    const results = await rideRepository.search(query)
    res.json({ data: results })
  } catch (err) {
    next(err)
  }
})

ridesRouter.get('/:id', async (req, res, next) => {
  try {
    const ride = await rideRepository.findById(req.params['id'] ?? '')
    if (!ride) {
      throw new AppError(404, 'Ride not found', 'RIDE_NOT_FOUND')
    }
    res.json({ data: ride })
  } catch (err) {
    next(err)
  }
})

ridesRouter.post(
  '/',
  requireAuth,
  validateBody(rideSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const userId = req.userId!
      const subscription = await prisma.subscription.findUnique({ where: { userId } })
      const plan = subscription?.plan ?? 'free'

      if (plan === 'free') {
        const postsThisMonth = await rideRepository.countPostsThisMonth(userId)
        if (postsThisMonth >= FREE_POSTS_PER_MONTH) {
          throw new AppError(
            403,
            'Free plan allows 3 ride posts per month. Upgrade to Pro for unlimited posts.',
            'FORBIDDEN',
          )
        }
      }

      const body = req.body as {
        origin: string
        destination: string
        pricePerSeat: number
        seatsTotal: number
      }
      const distanceKm = estimateDistanceKm(body.origin, body.destination)
      const priceCheck = validatePricePerSeat(body.pricePerSeat, distanceKm)
      if (!priceCheck.ok) {
        throw new AppError(400, priceCheck.warning ?? 'Invalid price', 'VALIDATION_ERROR')
      }

      const ride = await rideRepository.create(userId, req.body)
      res.status(201).json({ data: ride })
    } catch (err) {
      next(err)
    }
  },
)

ridesRouter.post(
  '/:id/seat-requests',
  requireAuth,
  validateBody(createSeatRequestSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { requestedSeats } = req.body as { requestedSeats: number }
      const request = await createSeatRequestForRide(
        req.params['id'] ?? '',
        req.userId!,
        requestedSeats,
      )
      res.status(201).json({ data: request })
    } catch (err) {
      next(err)
    }
  },
)

ridesRouter.delete('/:id', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const ride = await rideRepository.findById(req.params['id'] ?? '')
    if (!ride) {
      throw new AppError(404, 'Ride not found', 'RIDE_NOT_FOUND')
    }
    if (ride.driverId !== req.userId) {
      throw new AppError(403, 'Forbidden', 'FORBIDDEN')
    }
    await rideRepository.delete(ride.id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})
