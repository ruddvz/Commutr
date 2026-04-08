import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  phone: z.string().optional(),
  bio: z.string().max(300).optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  phone: z.string().optional(),
})

export type UserInput = z.infer<typeof userSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
