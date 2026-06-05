import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler.js'
import { env } from '../config/env.js'

export interface AuthRequest extends Request {
  userId?: string
  validatedQuery?: unknown
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers['authorization']
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  const cookies = req.headers.cookie
  if (!cookies) return null
  const match = cookies.match(/(?:^|;\s*)commutr_session=([^;]+)/)
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

export function requireAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const token = extractToken(req)
  if (!token) {
    next(new AppError(401, 'Unauthorized', 'AUTH_REQUIRED'))
    return
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string }
    req.userId = payload.sub
    next()
  } catch {
    next(new AppError(401, 'Invalid or expired token', 'SESSION_EXPIRED'))
  }
}

export async function requireAdmin(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = extractToken(req)
  if (!token) {
    next(new AppError(401, 'Unauthorized', 'AUTH_REQUIRED'))
    return
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string }
    req.userId = payload.sub
    const { prisma } = await import('../db/client.js')
    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    if (!user || user.role !== 'admin') {
      next(new AppError(403, 'Admin only', 'FORBIDDEN'))
      return
    }
    next()
  } catch {
    next(new AppError(401, 'Invalid or expired token', 'SESSION_EXPIRED'))
  }
}
