import { Router } from 'express'
import { z } from 'zod'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { prisma } from '../db/client.js'

export const reportsRouter = Router()

const reportSchema = z.object({
  targetUserId: z.string().uuid().optional(),
  rideId: z.string().uuid().optional(),
  reason: z.string().min(3).max(100),
  details: z.string().max(1000).optional(),
})

reportsRouter.post(
  '/',
  requireAuth,
  validateBody(reportSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const body = req.body as z.infer<typeof reportSchema>
      const report = await prisma.report.create({
        data: {
          reporterId: req.userId!,
          targetUserId: body.targetUserId,
          rideId: body.rideId,
          reason: body.reason,
          details: body.details,
          status: 'open',
        },
      })
      res.status(201).json({ data: report })
    } catch (err) {
      next(err)
    }
  },
)
