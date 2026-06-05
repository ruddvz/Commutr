export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  bio?: string
  verified: boolean
  rating?: number
  ratingAvg?: number
  ratingCount: number
  role?: string
  createdAt: string
}

export interface AuthUser extends User {
  token: string
}
