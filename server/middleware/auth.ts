import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler.js'
import { env } from '../config/env.js'

export interface AuthRequest extends Request {
  userId?: string
  validatedQuery?: unknown
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization']
  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError(401, 'Unauthorized', 'AUTH_REQUIRED'))
    return
  }

  const token = authHeader.slice(7)
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string }
    req.userId = payload.sub
    next()
  } catch {
    next(new AppError(401, 'Invalid or expired token', 'SESSION_EXPIRED'))
  }
}
