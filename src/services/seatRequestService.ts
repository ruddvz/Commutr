import { api } from './api'
import type { SeatRequest } from '@/contracts/types/SeatRequest'

export const seatRequestService = {
  listMine(): Promise<SeatRequest[]> {
    return api.get<SeatRequest[]>('/seat-requests/me')
  },

  requestSeat(rideId: string, requestedSeats: number): Promise<SeatRequest> {
    return api.post<SeatRequest>(`/rides/${rideId}/seat-requests`, { requestedSeats })
  },

  accept(id: string): Promise<SeatRequest> {
    return api.post<SeatRequest>(`/seat-requests/${id}/accept`, {})
  },

  reject(id: string): Promise<SeatRequest> {
    return api.post<SeatRequest>(`/seat-requests/${id}/reject`, {})
  },

  cancel(id: string): Promise<SeatRequest> {
    return api.post<SeatRequest>(`/seat-requests/${id}/cancel`, {})
  },

  confirm(id: string): Promise<SeatRequest> {
    return api.post<SeatRequest>(`/seat-requests/${id}/confirm`, {})
  },
}
