import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validate } from '../middleware/validate.js'
import { AppError } from '../middleware/errorHandler.js'
import { registerSchema, loginSchema } from '../../src/contracts/schemas/userSchema.js'

export const authRouter = Router()

const JWT_SECRET = process.env['JWT_SECRET'] ?? ''
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] ?? '7d'
const BCRYPT_ROUNDS = parseInt(process.env['BCRYPT_ROUNDS'] ?? '12', 10)

// In-memory user store — replace with a DB layer in production
interface StoredUser {
  id: string
  name: string
  email: string
  passwordHash: string
  verified: boolean
  rating: number
  ratingCount: number
  createdAt: string
}
const users = new Map<string, StoredUser>()

authRouter.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string }

    if ([...users.values()].some((u) => u.email === email)) {
      throw new AppError(409, 'Email already registered')
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)
    const id = crypto.randomUUID()
    const user: StoredUser = {
      id,
      name,
      email,
      passwordHash,
      verified: false,
      rating: 0,
      ratingCount: 0,
      createdAt: new Date().toISOString(),
    }
    users.set(id, user)

    const token = jwt.sign({ sub: id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    const { passwordHash: _, ...safeUser } = user
    res.status(201).json({ ...safeUser, token })
  } catch (err) {
    next(err)
  }
})

authRouter.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body as { email: string; password: string }
    const user = [...users.values()].find((u) => u.email === email)

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError(401, 'Invalid email or password')
    }

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    const { passwordHash: _, ...safeUser } = user
    res.json({ ...safeUser, token })
  } catch (err) {
    next(err)
  }
})
