import { api } from './api'
import type { AuthUser, User } from '@/contracts/types/User'
import type { RegisterInput, LoginInput } from '@/contracts/schemas/userSchema'

export const authService = {
  async register(input: RegisterInput): Promise<AuthUser> {
    const user = await api.post<AuthUser>('/auth/register', input)
    localStorage.setItem('commutr_token', user.token)
    return user
  },

  async login(input: LoginInput): Promise<AuthUser> {
    const user = await api.post<AuthUser>('/auth/login', input)
    localStorage.setItem('commutr_token', user.token)
    return user
  },

  async fetchMe(): Promise<User> {
    return api.get<User>('/auth/me')
  },

  async logout(): Promise<void> {
    localStorage.removeItem('commutr_token')
    await api.post<{ ok: boolean }>('/auth/logout', {}).catch(() => undefined)
  },

  isAuthenticated(): boolean {
    return localStorage.getItem('commutr_token') !== null
  },
}
