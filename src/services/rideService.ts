import { api } from './api'
import type { Ride } from '@/contracts/types/Ride'
import type { RideInput, SearchInput } from '@/contracts/schemas/rideSchema'

export const rideService = {
  search(params: SearchInput): Promise<Ride[]> {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)]),
    ).toString()
    return api.get<Ride[]>(`/rides?${qs}`)
  },

  getById(id: string): Promise<Ride> {
    return api.get<Ride>(`/rides/${id}`)
  },

  create(input: RideInput): Promise<Ride> {
    return api.post<Ride>('/rides', input)
  },

  cancel(id: string): Promise<void> {
    return api.delete(`/rides/${id}`)
  },
}
