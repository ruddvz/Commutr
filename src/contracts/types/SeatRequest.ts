export type SeatRequestStatus =
  | 'requested'
  | 'held'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'expired'
  | 'completed'

export interface SeatRequest {
  id: string
  rideId: string
  passengerId: string
  requestedSeats: number
  status: SeatRequestStatus
  holdExpiresAt?: string
  totalCostShare?: number
  createdAt: string
}
