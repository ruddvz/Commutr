import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler.js'

const JWT_SECRET = process.env['JWT_SECRET'] ?? ''

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set.')
  process.exit(1)
}

export interface AuthRequest extends Request {
  userId?: string
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization']
  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError(401, 'Unauthorized'))
    return
  }

  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string }
    req.userId = payload.sub
    next()
  } catch {
    next(new AppError(401, 'Invalid or expired token'))
  }
}
