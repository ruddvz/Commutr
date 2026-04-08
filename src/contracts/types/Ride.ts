export interface Ride {
  id: string
  driverId: string
  driverName: string
  driverAvatarUrl?: string
  driverVerified: boolean
  driverRating: number
  origin: string
  destination: string
  departureAt: string
  pricePerSeat: number
  seatsAvailable: number
  seatsTotal: number
  stops: string[]
  notes?: string
  amenities: string[]
  status: 'active' | 'full' | 'completed' | 'cancelled'
  createdAt: string
}
