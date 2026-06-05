import type { Ride } from '@/contracts/types/Ride'
import { storageGet, storageSet } from '@/utils/storage'

const DEMO_RIDES_KEY = 'commutr_demo_rides'
const CACHED_RIDES_KEY = 'commutr_cached_rides'

function baseDemoRides(): Ride[] {
  const now = Date.now()
  return [
    {
      id: 'demo-lon-tor-1',
      driverId: 'demo-driver-1',
      driverName: 'Aarav P.',
      driverVerified: true,
      driverRating: 4.9,
      origin: 'London, ON',
      destination: 'Toronto, ON',
      departureAt: new Date(now + 1000 * 60 * 60 * 5).toISOString(),
      pricePerSeat: 28,
      seatsTotal: 3,
      seatsAvailable: 2,
      stops: ['Masonville Mall', 'Union Station area'],
      notes: 'Honda Civic · No platform fee',
      amenities: ['Luggage', 'No smoking', 'women-preferred'],
      status: 'active',
      createdAt: new Date(now - 86400000).toISOString(),
    },
    {
      id: 'demo-lon-tor-2',
      driverId: 'demo-driver-2',
      driverName: 'Maya S.',
      driverVerified: true,
      driverRating: 4.8,
      origin: 'London, ON',
      destination: 'Toronto, ON',
      departureAt: new Date(now + 1000 * 60 * 60 * 9).toISOString(),
      pricePerSeat: 30,
      seatsTotal: 4,
      seatsAvailable: 1,
      stops: ['Downtown London', 'Scarborough Town Centre'],
      notes: 'Toyota Corolla',
      amenities: ['Verified'],
      status: 'active',
      createdAt: new Date(now - 172800000).toISOString(),
    },
    {
      id: 'demo-tor-mtl-1',
      driverId: 'demo-driver-3',
      driverName: 'Sophie L.',
      driverVerified: true,
      driverRating: 4.7,
      origin: 'Toronto, ON',
      destination: 'Montréal, QC',
      departureAt: new Date(now + 1000 * 60 * 60 * 14).toISOString(),
      pricePerSeat: 45,
      seatsTotal: 3,
      seatsAvailable: 2,
      stops: ['Scarborough', 'Downtown Montréal'],
      amenities: ['Luggage', 'AC'],
      status: 'active',
      createdAt: new Date(now - 259200000).toISOString(),
    },
    {
      id: 'demo-ott-mtl-1',
      driverId: 'demo-driver-4',
      driverName: 'James K.',
      driverVerified: true,
      driverRating: 5.0,
      origin: 'Ottawa, ON',
      destination: 'Montréal, QC',
      departureAt: new Date(now + 1000 * 60 * 60 * 7).toISOString(),
      pricePerSeat: 25,
      seatsTotal: 4,
      seatsAvailable: 3,
      stops: ['Kanata', 'Old Port'],
      amenities: ['No smoking'],
      status: 'active',
      createdAt: new Date(now - 345600000).toISOString(),
    },
  ]
}

export function getDemoRides(): Ride[] {
  const local = storageGet<Ride[]>(DEMO_RIDES_KEY)
  const seeded = baseDemoRides()
  if (!local?.length) return seeded
  const ids = new Set(seeded.map((r) => r.id))
  const extra = local.filter((r) => !ids.has(r.id))
  return [...seeded, ...extra]
}

export function saveDemoRide(ride: Ride): void {
  const local = storageGet<Ride[]>(DEMO_RIDES_KEY) ?? []
  local.unshift(ride)
  storageSet(DEMO_RIDES_KEY, local)
}

export function getCachedRides(): Ride[] {
  return storageGet<Ride[]>(CACHED_RIDES_KEY) ?? []
}

export function cacheRides(rides: Ride[]): void {
  if (rides.length > 0) storageSet(CACHED_RIDES_KEY, rides)
}

export function getDemoRideById(id: string): Ride | undefined {
  return getDemoRides().find((r) => r.id === id)
}

export type DemoUser = {
  id: string
  name: string
  email: string
  verified: boolean
  ratingAvg: number
  ratingCount: number
  trips: number
  joinedYear: number
  location: string
}

export function getDemoUser(): DemoUser {
  return {
    id: 'local-user',
    name: 'Rudra P.',
    email: 'demo@commutr.app',
    verified: true,
    ratingAvg: 4.9,
    ratingCount: 8,
    trips: 12,
    joinedYear: 2026,
    location: 'London, ON',
  }
}

export function getPostedDemoRides(): Ride[] {
  return getDemoRides().filter((r) => r.driverId === 'local-user' || r.driverName === 'You')
}

export type RideSearchQuery = {
  origin?: string
  destination?: string
  date?: string
  seats?: number
  verifiedOnly?: boolean
  womenPreferredOnly?: boolean
  maxPricePerSeat?: number
}

function hasWomenPreferred(ride: Ride): boolean {
  return ride.amenities.some((a) => a.toLowerCase().includes('women'))
}

export function filterDemoRides(query: RideSearchQuery): Ride[] {
  let rides = getDemoRides()

  if (query.origin) {
    const o = query.origin.toLowerCase()
    rides = rides.filter((r) => r.origin.toLowerCase().includes(o.split(',')[0] ?? o))
  }
  if (query.destination) {
    const d = query.destination.toLowerCase()
    rides = rides.filter((r) => r.destination.toLowerCase().includes(d.split(',')[0] ?? d))
  }
  if (query.seats) {
    rides = rides.filter((r) => r.seatsAvailable >= query.seats!)
  }
  if (query.verifiedOnly) {
    rides = rides.filter((r) => r.driverVerified)
  }
  if (query.womenPreferredOnly) {
    rides = rides.filter((r) => hasWomenPreferred(r))
  }
  if (query.maxPricePerSeat !== undefined) {
    rides = rides.filter((r) => r.pricePerSeat <= query.maxPricePerSeat!)
  }
  if (query.date) {
    const day = query.date.slice(0, 10)
    rides = rides.filter((r) => r.departureAt.slice(0, 10) === day || !query.date)
  }

  return rides.filter((r) => r.status === 'active')
}
