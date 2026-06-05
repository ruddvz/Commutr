import type { Response } from 'express'
import { env } from '../config/env.js'

const COOKIE_NAME = 'commutr_session'

export function setSessionCookie(res: Response, token: string): void {
  const secure = env.NODE_ENV === 'production'
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, { path: '/' })
}
