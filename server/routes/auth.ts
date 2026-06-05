import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'
import { validateBody } from '../middleware/validate.js'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { AppError } from '../middleware/errorHandler.js'
import { registerSchema, loginSchema } from '../../src/contracts/schemas/userSchema.js'
import { env } from '../config/env.js'
import { Prisma } from '@prisma/client'
import { userRepository, toSafeUser } from '../repositories/userRepository.js'
import { setSessionCookie, clearSessionCookie } from '../lib/sessionCookie.js'

export const authRouter = Router()

const signOptions: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] }

function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, signOptions)
}

authRouter.post('/register', validateBody(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string }

    if (await userRepository.findByEmail(email)) {
      throw new AppError(409, 'Email already registered', 'VALIDATION_ERROR')
    }

    const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS)
    const user = await userRepository.create({ name, email, passwordHash })
    const token = signToken(user.id)
    setSessionCookie(res, token)
    res.status(201).json({ data: { ...toSafeUser(user), token } })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      next(new AppError(409, 'Email already registered', 'VALIDATION_ERROR'))
      return
    }
    next(err)
  }
})

authRouter.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body as { email: string; password: string }
    const user = await userRepository.findByEmail(email)

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError(401, 'Invalid email or password', 'AUTH_REQUIRED')
    }

    const token = signToken(user.id)
    setSessionCookie(res, token)
    res.json({ data: { ...toSafeUser(user), token } })
  } catch (err) {
    next(err)
  }
})

authRouter.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await userRepository.findById(req.userId!)
    if (!user) {
      throw new AppError(404, 'User not found', 'AUTH_REQUIRED')
    }
    res.json({ data: toSafeUser(user) })
  } catch (err) {
    next(err)
  }
})

authRouter.post('/logout', (_req, res) => {
  clearSessionCookie(res)
  res.json({ data: { ok: true } })
})
