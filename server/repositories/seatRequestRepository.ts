import { prisma } from '../db/client.js'
import type { SeatRequest } from '../../src/contracts/types/SeatRequest.js'

const HOLD_HOURS = 24

function toDto(row: {
  id: string
  rideId: string
  passengerId: string
  requestedSeats: number
  status: string
  holdExpiresAt: Date | null
  totalCostShare: number | null
  createdAt: Date
}): SeatRequest {
  return {
    id: row.id,
    rideId: row.rideId,
    passengerId: row.passengerId,
    requestedSeats: row.requestedSeats,
    status: row.status as SeatRequest['status'],
    holdExpiresAt: row.holdExpiresAt?.toISOString(),
    totalCostShare: row.totalCostShare ?? undefined,
    createdAt: row.createdAt.toISOString(),
  }
}

export const seatRequestRepository = {
  toDto,

  async create(rideId: string, passengerId: string, requestedSeats: number): Promise<SeatRequest> {
    const row = await prisma.seatRequest.create({
      data: { rideId, passengerId, requestedSeats, status: 'requested' },
    })
    return toDto(row)
  },

  async findById(id: string) {
    return prisma.seatRequest.findUnique({ where: { id } })
  },

  async listForUser(passengerId: string): Promise<SeatRequest[]> {
    const rows = await prisma.seatRequest.findMany({
      where: { passengerId },
      orderBy: { createdAt: 'desc' },
    })
    return rows.map(toDto)
  },

  async listForRide(rideId: string): Promise<SeatRequest[]> {
    const rows = await prisma.seatRequest.findMany({
      where: { rideId },
      orderBy: { createdAt: 'desc' },
    })
    return rows.map(toDto)
  },

  async accept(id: string, totalCostShare: number): Promise<SeatRequest> {
    const holdExpiresAt = new Date(Date.now() + HOLD_HOURS * 60 * 60 * 1000)
    const row = await prisma.seatRequest.update({
      where: { id },
      data: { status: 'held', holdExpiresAt, totalCostShare },
    })
    return toDto(row)
  },

  async reject(id: string): Promise<SeatRequest> {
    const row = await prisma.seatRequest.update({
      where: { id },
      data: { status: 'rejected', holdExpiresAt: null },
    })
    return toDto(row)
  },

  async cancel(id: string): Promise<SeatRequest> {
    const row = await prisma.seatRequest.update({
      where: { id },
      data: { status: 'cancelled', holdExpiresAt: null },
    })
    return toDto(row)
  },

  async confirm(id: string): Promise<SeatRequest> {
    const row = await prisma.seatRequest.update({
      where: { id },
      data: { status: 'confirmed' },
    })
    return toDto(row)
  },
}
