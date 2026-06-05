import { api } from './api'
import type { SeatRequest } from '@/contracts/types/SeatRequest'
import { isDemoExperience } from '@/config/runtime'
import { storageGet, storageSet } from '@/utils/storage'

const DEMO_REQUESTS_KEY = 'commutr_demo_seat_requests'

function demoRequests(): SeatRequest[] {
  return storageGet<SeatRequest[]>(DEMO_REQUESTS_KEY) ?? []
}

function saveDemoRequest(req: SeatRequest): void {
  const list = demoRequests()
  list.unshift(req)
  storageSet(DEMO_REQUESTS_KEY, list)
}

export const seatRequestService = {
  listMine(): Promise<SeatRequest[]> {
    if (isDemoExperience()) return Promise.resolve(demoRequests())
    return api.get<SeatRequest[]>('/seat-requests/me')
  },

  requestSeat(rideId: string, requestedSeats: number): Promise<SeatRequest> {
    if (isDemoExperience()) {
      const req: SeatRequest = {
        id: `demo-req-${Date.now()}`,
        rideId,
        passengerId: 'local-user',
        requestedSeats,
        status: 'requested',
        createdAt: new Date().toISOString(),
      }
      saveDemoRequest(req)
      return Promise.resolve(req)
    }
    return api.post<SeatRequest>(`/rides/${rideId}/seat-requests`, { requestedSeats })
  },

  accept(id: string): Promise<SeatRequest> {
    if (isDemoExperience())
      return Promise.resolve({ ...demoRequests()[0]!, id, status: 'confirmed' as const })
    return api.post<SeatRequest>(`/seat-requests/${id}/accept`, {})
  },

  reject(id: string): Promise<SeatRequest> {
    if (isDemoExperience())
      return Promise.resolve({ ...demoRequests()[0]!, id, status: 'rejected' })
    return api.post<SeatRequest>(`/seat-requests/${id}/reject`, {})
  },

  cancel(id: string): Promise<SeatRequest> {
    if (isDemoExperience())
      return Promise.resolve({ ...demoRequests()[0]!, id, status: 'cancelled' })
    return api.post<SeatRequest>(`/seat-requests/${id}/cancel`, {})
  },

  confirm(id: string): Promise<SeatRequest> {
    if (isDemoExperience())
      return Promise.resolve({ ...demoRequests()[0]!, id, status: 'confirmed' })
    return api.post<SeatRequest>(`/seat-requests/${id}/confirm`, {})
  },
}
