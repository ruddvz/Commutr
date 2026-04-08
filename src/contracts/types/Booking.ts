export interface Booking {
  id: string
  rideId: string
  passengerId: string
  seats: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
}
