import { Router } from 'express'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { AppError } from '../middleware/errorHandler.js'
import { seatRequestActionSchema } from '../../src/contracts/schemas/seatRequestSchema.js'
import type { SeatRequest } from '../../src/contracts/types/SeatRequest.js'
import { seatRequestRepository } from '../repositories/seatRequestRepository.js'
import { rideRepository } from '../repositories/rideRepository.js'
import { chatRepository } from '../repositories/chatRepository.js'

export const seatRequestsRouter = Router()

seatRequestsRouter.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const list = await seatRequestRepository.listForUser(req.userId!)
    res.json({ data: list })
  } catch (err) {
    next(err)
  }
})

export async function createSeatRequestForRide(
  rideId: string,
  passengerId: string,
  requestedSeats: number,
): Promise<SeatRequest> {
  const ride = await rideRepository.findById(rideId)
  if (!ride) {
    throw new AppError(404, 'Ride not found', 'RIDE_NOT_FOUND')
  }
  if (ride.driverId === passengerId) {
    throw new AppError(400, 'Cannot request a seat on your own ride', 'VALIDATION_ERROR')
  }
  if (ride.status !== 'active') {
    throw new AppError(400, 'Ride is not accepting requests', 'RIDE_FULL')
  }
  if (ride.seatsAvailable < requestedSeats) {
    throw new AppError(400, 'Not enough seats available', 'RIDE_FULL')
  }

  const request = await seatRequestRepository.create(rideId, passengerId, requestedSeats)
  await chatRepository.findOrCreateConversation({
    participantIds: [ride.driverId, passengerId],
    rideId,
    seatRequestId: request.id,
  })
  return request
}

async function loadRequestForAction(
  id: string,
  userId: string,
): Promise<{
  row: NonNullable<Awaited<ReturnType<typeof seatRequestRepository.findById>>>
  ride: NonNullable<Awaited<ReturnType<typeof rideRepository.findById>>>
  isDriver: boolean
  isPassenger: boolean
}> {
  const row = await seatRequestRepository.findById(id)
  if (!row) {
    throw new AppError(404, 'Seat request not found', 'SEAT_REQUEST_NOT_FOUND')
  }
  const ride = await rideRepository.findById(row.rideId)
  if (!ride) {
    throw new AppError(404, 'Ride not found', 'RIDE_NOT_FOUND')
  }
  const isDriver = ride.driverId === userId
  const isPassenger = row.passengerId === userId
  if (!isDriver && !isPassenger) {
    throw new AppError(403, 'Forbidden', 'FORBIDDEN')
  }
  return { row, ride, isDriver, isPassenger }
}

seatRequestsRouter.post('/:id/accept', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { row, ride, isDriver } = await loadRequestForAction(req.params['id'] ?? '', req.userId!)
    if (!isDriver) {
      throw new AppError(403, 'Only the driver can accept requests', 'FORBIDDEN')
    }
    if (row.status !== 'requested') {
      throw new AppError(400, 'Request is not pending', 'VALIDATION_ERROR')
    }
    if (ride.seatsAvailable < row.requestedSeats) {
      throw new AppError(400, 'Not enough seats available', 'RIDE_FULL')
    }

    const totalCostShare = ride.pricePerSeat * row.requestedSeats
    const updated = await seatRequestRepository.accept(row.id, totalCostShare)
    const seatsAvailable = ride.seatsAvailable - row.requestedSeats
    const status = seatsAvailable === 0 ? 'full' : 'active'
    await rideRepository.updateSeatsAvailable(ride.id, seatsAvailable, status)

    res.json({ data: updated })
  } catch (err) {
    next(err)
  }
})

seatRequestsRouter.post('/:id/reject', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { row, isDriver } = await loadRequestForAction(req.params['id'] ?? '', req.userId!)
    if (!isDriver) {
      throw new AppError(403, 'Only the driver can reject requests', 'FORBIDDEN')
    }
    const updated = await seatRequestRepository.reject(row.id)
    res.json({ data: updated })
  } catch (err) {
    next(err)
  }
})

seatRequestsRouter.post('/:id/cancel', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { row, ride, isDriver, isPassenger } = await loadRequestForAction(
      req.params['id'] ?? '',
      req.userId!,
    )
    if (!isDriver && !isPassenger) {
      throw new AppError(403, 'Forbidden', 'FORBIDDEN')
    }

    const updated = await seatRequestRepository.cancel(row.id)

    if (row.status === 'held' || row.status === 'confirmed') {
      const seatsAvailable = Math.min(ride.seatsTotal, ride.seatsAvailable + row.requestedSeats)
      await rideRepository.updateSeatsAvailable(
        ride.id,
        seatsAvailable,
        seatsAvailable > 0 ? 'active' : ride.status,
      )
    }

    res.json({ data: updated })
  } catch (err) {
    next(err)
  }
})

seatRequestsRouter.post(
  '/:id/confirm',
  requireAuth,
  validateBody(seatRequestActionSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { row, isPassenger } = await loadRequestForAction(req.params['id'] ?? '', req.userId!)
      if (!isPassenger) {
        throw new AppError(403, 'Only the passenger can confirm', 'FORBIDDEN')
      }
      if (row.status !== 'held') {
        throw new AppError(400, 'Seat is not held', 'HOLD_EXPIRED')
      }
      if (row.holdExpiresAt && row.holdExpiresAt < new Date()) {
        throw new AppError(400, 'Hold has expired', 'HOLD_EXPIRED')
      }
      const updated = await seatRequestRepository.confirm(row.id)
      res.json({ data: updated })
    } catch (err) {
      next(err)
    }
  },
)
