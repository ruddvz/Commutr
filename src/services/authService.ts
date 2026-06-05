import { api } from './api'
import type { AuthUser, User } from '@/contracts/types/User'
import type { RegisterInput, LoginInput } from '@/contracts/schemas/userSchema'
import { isStaticDemo } from '@/config/runtime'
import { getDemoUser } from '@/config/demoData'

const DEMO_TOKEN = 'commutr-demo-guest'

export const authService = {
  async register(input: RegisterInput): Promise<AuthUser> {
    if (isStaticDemo) return this.continueAsGuest(input.name)
    const user = await api.post<AuthUser>('/auth/register', input)
    localStorage.setItem('commutr_token', user.token)
    return user
  },

  async login(input: LoginInput): Promise<AuthUser> {
    if (isStaticDemo) return this.continueAsGuest()
    const user = await api.post<AuthUser>('/auth/login', input)
    localStorage.setItem('commutr_token', user.token)
    return user
  },

  continueAsGuest(name?: string): AuthUser {
    const demo = getDemoUser()
    const user: AuthUser = {
      id: demo.id,
      name: name ?? demo.name,
      email: demo.email,
      verified: demo.verified,
      ratingCount: demo.ratingCount,
      createdAt: new Date(demo.joinedYear, 0, 1).toISOString(),
      token: DEMO_TOKEN,
    }
    localStorage.setItem('commutr_token', DEMO_TOKEN)
    return user
  },

  async fetchMe(): Promise<User> {
    if (isStaticDemo || localStorage.getItem('commutr_token') === DEMO_TOKEN) {
      const demo = getDemoUser()
      return {
        id: demo.id,
        name: demo.name,
        email: demo.email,
        verified: demo.verified,
        ratingAvg: demo.ratingAvg,
        ratingCount: demo.ratingCount,
        createdAt: new Date(demo.joinedYear, 0, 1).toISOString(),
      }
    }
    return api.get<User>('/auth/me')
  },

  async logout(): Promise<void> {
    localStorage.removeItem('commutr_token')
    if (!isStaticDemo) {
      await api.post<{ ok: boolean }>('/auth/logout', {}).catch(() => undefined)
    }
  },

  isAuthenticated(): boolean {
    return localStorage.getItem('commutr_token') !== null
  },

  isDemoGuest(): boolean {
    return localStorage.getItem('commutr_token') === DEMO_TOKEN || isStaticDemo
  },
}
