import { Router } from 'express'
import { z } from 'zod'
import { requireAdmin, type AuthRequest } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { prisma } from '../db/client.js'

export const adminRouter = Router()

adminRouter.get('/reports', requireAdmin, async (_req, res, next) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    res.json({ data: reports })
  } catch (err) {
    next(err)
  }
})

const reportActionSchema = z.object({
  status: z.enum(['open', 'reviewing', 'resolved', 'dismissed']),
})

adminRouter.patch(
  '/reports/:id',
  requireAdmin,
  validateBody(reportActionSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { status } = req.body as z.infer<typeof reportActionSchema>
      const report = await prisma.report.update({
        where: { id: req.params['id'] ?? '' },
        data: { status },
      })
      res.json({ data: report })
    } catch (err) {
      next(err)
    }
  },
)

adminRouter.get('/users', requireAdmin, async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verified: true,
        verifiedId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    })
    res.json({ data: users })
  } catch (err) {
    next(err)
  }
})
