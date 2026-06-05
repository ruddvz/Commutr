import type { Ride as PrismaRide, User } from '@prisma/client'
import { prisma } from '../db/client.js'
import type { Ride } from '../../src/contracts/types/Ride.js'
import type { RideInput } from '../../src/contracts/schemas/rideSchema.js'

type RideWithDriver = PrismaRide & { driver: User }

function parseJsonArray(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function toRideDto(row: RideWithDriver): Ride {
  return {
    id: row.id,
    driverId: row.driverId,
    driverName: row.driver.name,
    driverVerified: row.driver.verifiedId,
    driverRating: row.driver.ratingAvg,
    origin: row.origin,
    destination: row.destination,
    departureAt: row.departureAt,
    pricePerSeat: row.pricePerSeat,
    seatsAvailable: row.seatsAvailable,
    seatsTotal: row.seatsTotal,
    stops: parseJsonArray(row.stops),
    notes: row.notes ?? undefined,
    amenities: parseJsonArray(row.amenities),
    status: row.status as Ride['status'],
    createdAt: row.createdAt.toISOString(),
  }
}

export const rideRepository = {
  async search(filters: {
    origin?: string
    destination?: string
    date?: string
    seats?: number
    maxPrice?: number
  }): Promise<Ride[]> {
    const rows = await prisma.ride.findMany({
      where: { status: 'active' },
      include: { driver: true },
      orderBy: { departureAt: 'asc' },
    })

    let results = rows.map(toRideDto)

    if (filters.origin) {
      const q = filters.origin.toLowerCase()
      results = results.filter((r) => r.origin.toLowerCase().includes(q))
    }
    if (filters.destination) {
      const q = filters.destination.toLowerCase()
      results = results.filter((r) => r.destination.toLowerCase().includes(q))
    }
    if (filters.date) {
      results = results.filter((r) => r.departureAt.startsWith(filters.date!))
    }
    if (filters.seats !== undefined) {
      results = results.filter((r) => r.seatsAvailable >= filters.seats!)
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter((r) => r.pricePerSeat <= filters.maxPrice!)
    }

    return results
  },

  async findById(id: string): Promise<Ride | null> {
    const row = await prisma.ride.findUnique({
      where: { id },
      include: { driver: true },
    })
    return row ? toRideDto(row) : null
  },

  async create(driverId: string, input: RideInput): Promise<Ride> {
    const row = await prisma.ride.create({
      data: {
        driverId,
        origin: input.origin,
        destination: input.destination,
        departureAt: input.departureAt,
        pricePerSeat: input.pricePerSeat,
        seatsTotal: input.seatsTotal,
        seatsAvailable: input.seatsTotal,
        stops: JSON.stringify(input.stops ?? []),
        notes: input.notes,
        amenities: JSON.stringify(input.amenities ?? []),
        status: 'active',
      },
      include: { driver: true },
    })
    return toRideDto(row)
  },

  async updateSeatsAvailable(
    rideId: string,
    seatsAvailable: number,
    status: string,
  ): Promise<void> {
    await prisma.ride.update({
      where: { id: rideId },
      data: { seatsAvailable, status },
    })
  },

  async delete(id: string): Promise<void> {
    await prisma.ride.delete({ where: { id } })
  },

  async countPostsThisMonth(driverId: string): Promise<number> {
    const start = new Date()
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
    return prisma.ride.count({
      where: {
        driverId,
        createdAt: { gte: start },
      },
    })
  },
}
