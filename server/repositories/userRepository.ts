import type { User as PrismaUser } from '@prisma/client'
import { prisma } from '../db/client.js'

export type SafeUser = Omit<PrismaUser, 'passwordHash'>

export function toSafeUser(user: PrismaUser): SafeUser {
  const { passwordHash, ...safe } = user
  void passwordHash
  return safe
}

export const userRepository = {
  async findByEmail(email: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  },

  async findById(id: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({ where: { id } })
  },

  async create(data: {
    name: string
    email: string
    passwordHash: string
    phone?: string
  }): Promise<PrismaUser> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        phone: data.phone,
      },
    })
  },
}
