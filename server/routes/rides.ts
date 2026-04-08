import { Router } from 'express'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { AppError } from '../middleware/errorHandler.js'
import { rideSchema, searchSchema } from '../../src/contracts/schemas/rideSchema.js'
import type { Ride } from '../../src/contracts/types/Ride.js'

export const ridesRouter = Router()

// In-memory ride store — replace with a DB layer in production
const rides = new Map<string, Ride>()

ridesRouter.get('/', validate(searchSchema.partial()), (req, res) => {
  const { origin, destination, date, seats, maxPrice } = req.query as Record<string, string>
  let results = [...rides.values()].filter((r) => r.status === 'active')

  if (origin) results = results.filter((r) => r.origin.toLowerCase().includes(origin.toLowerCase()))
  if (destination) results = results.filter((r) => r.destination.toLowerCase().includes(destination.toLowerCase()))
  if (date) results = results.filter((r) => r.departureAt.startsWith(date))
  if (seats) results = results.filter((r) => r.seatsAvailable >= parseInt(seats, 10))
  if (maxPrice) results = results.filter((r) => r.pricePerSeat <= parseFloat(maxPrice))

  res.json(results)
})

ridesRouter.get('/:id', (req, res, next) => {
  const ride = rides.get(req.params['id'] ?? '')
  if (!ride) {
    next(new AppError(404, 'Ride not found'))
    return
  }
  res.json(ride)
})

ridesRouter.post('/', requireAuth, validate(rideSchema), (req: AuthRequest, res) => {
  const id = crypto.randomUUID()
  const ride: Ride = {
    id,
    driverId: req.userId!,
    driverName: 'Driver',
    driverVerified: false,
    driverRating: 0,
    ...req.body,
    status: 'active',
    createdAt: new Date().toISOString(),
  }
  rides.set(id, ride)
  res.status(201).json(ride)
})

ridesRouter.delete('/:id', requireAuth, (req: AuthRequest, res, next) => {
  const ride = rides.get(req.params['id'] ?? '')
  if (!ride) {
    next(new AppError(404, 'Ride not found'))
    return
  }
  if (ride.driverId !== req.userId) {
    next(new AppError(403, 'Forbidden'))
    return
  }
  rides.delete(ride.id)
  res.status(204).send()
})
