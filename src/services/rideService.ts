import { api } from './api'
import type { Ride } from '@/contracts/types/Ride'
import type { RideInput, SearchInput } from '@/contracts/schemas/rideSchema'
import { runtimeMode } from '@/config/runtime'
import {
  cacheRides,
  filterDemoRides,
  getCachedRides,
  getDemoRideById,
  getDemoRides,
  saveDemoRide,
  type RideSearchQuery,
} from '@/config/demoData'

export type SearchRidesResult =
  | { status: 'live'; rides: Ride[] }
  | { status: 'cached'; rides: Ride[]; reason: string }
  | { status: 'demo'; rides: Ride[]; reason: string }
  | { status: 'empty'; rides: [] }

const HEALTH_TIMEOUT_MS = 3000

async function healthCheck(): Promise<boolean> {
  if (runtimeMode === 'static-demo') return false
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS)
  try {
    const base = import.meta.env['VITE_API_BASE_URL'] ?? '/api'
    const res = await fetch(`${base}/health`, { signal: controller.signal })
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

function toQuery(params: SearchInput): RideSearchQuery {
  return {
    origin: params.origin,
    destination: params.destination,
    date: params.date,
    seats: params.seats,
    verifiedOnly: params.verifiedOnly,
  }
}

function fallbackRides(query: RideSearchQuery, reason: string): SearchRidesResult {
  const cached = getCachedRides()
  const cachedFiltered = cached.length ? filterDemoRides({ ...query }) : []
  if (cachedFiltered.length) {
    return { status: 'cached', rides: cachedFiltered, reason }
  }

  const demo = filterDemoRides(query)
  if (demo.length) {
    return { status: 'demo', rides: demo, reason }
  }

  const allDemo = filterDemoRides({})
  if (allDemo.length) {
    return { status: 'demo', rides: allDemo, reason }
  }

  return { status: 'empty', rides: [] }
}

export async function searchRides(params: SearchInput = {}): Promise<SearchRidesResult> {
  if (runtimeMode === 'static-demo') {
    const rides = filterDemoRides(toQuery(params))
    return rides.length
      ? { status: 'demo', rides, reason: 'Showing sample routes on GitHub Pages.' }
      : { status: 'empty', rides: [] }
  }

  const healthy = await healthCheck()
  if (!healthy) {
    return fallbackRides(toQuery(params), 'Could not reach live rides.')
  }

  try {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)]),
    ).toString()
    const rides = await api.get<Ride[]>(`/rides?${qs}`)
    if (rides.length) cacheRides(rides)
    return rides.length ? { status: 'live', rides } : { status: 'empty', rides: [] }
  } catch {
    return fallbackRides(toQuery(params), 'Could not reach live rides.')
  }
}

export const rideService = {
  search(params: SearchInput): Promise<Ride[]> {
    return searchRides(params).then((r) => r.rides)
  },

  async getById(id: string): Promise<Ride> {
    if (runtimeMode === 'static-demo') {
      const demo = getDemoRideById(id)
      if (demo) return demo
      throw new Error('Ride not found')
    }
    try {
      return await api.get<Ride>(`/rides/${id}`)
    } catch {
      const demo = getDemoRideById(id)
      if (demo) return demo
      const cached = getCachedRides().find((r) => r.id === id)
      if (cached) return cached
      throw new Error('Ride not found')
    }
  },

  async create(input: RideInput): Promise<Ride> {
    if (runtimeMode === 'static-demo') {
      const ride: Ride = {
        id: `local-${Date.now()}`,
        driverId: 'local-user',
        driverName: 'You',
        driverVerified: false,
        driverRating: 0,
        origin: input.origin,
        destination: input.destination,
        departureAt: input.departureAt,
        pricePerSeat: input.pricePerSeat,
        seatsTotal: input.seatsTotal,
        seatsAvailable: input.seatsTotal,
        stops: input.stops ?? [],
        notes: input.notes,
        amenities: input.amenities ?? [],
        status: 'active',
        createdAt: new Date().toISOString(),
      }
      saveDemoRide(ride)
      return ride
    }
    return api.post<Ride>('/rides', input)
  },

  cancel(id: string): Promise<void> {
    if (runtimeMode === 'static-demo') return Promise.resolve()
    return api.delete(`/rides/${id}`)
  },

  getDemoRides,
}
