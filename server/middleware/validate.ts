import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'
import { AppError } from './errorHandler.js'

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ')
      next(new AppError(400, message, 'VALIDATION_ERROR', result.error.flatten()))
      return
    }
    req.body = result.data
    next()
  }
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ')
      next(new AppError(400, message, 'VALIDATION_ERROR', result.error.flatten()))
      return
    }
    ;(req as Request & { validatedQuery: unknown }).validatedQuery = result.data
    next()
  }
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params)
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ')
      next(new AppError(400, message, 'VALIDATION_ERROR', result.error.flatten()))
      return
    }
    req.params = result.data as Record<string, string>
    next()
  }
}

/** @deprecated Use validateBody instead */
export const validate = validateBody
