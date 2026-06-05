import { Router } from 'express'
import { z } from 'zod'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { prisma } from '../db/client.js'

export const routeAlertsRouter = Router()

const alertSchema = z.object({
  origin: z.string().min(2).max(100),
  destination: z.string().min(2).max(100),
  dateWindow: z.string().max(100).optional(),
})

routeAlertsRouter.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const alerts = await prisma.routeAlert.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ data: alerts })
  } catch (err) {
    next(err)
  }
})

routeAlertsRouter.post(
  '/',
  requireAuth,
  validateBody(alertSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const body = req.body as z.infer<typeof alertSchema>
      const alert = await prisma.routeAlert.create({
        data: {
          userId: req.userId!,
          origin: body.origin,
          destination: body.destination,
          dateWindow: body.dateWindow,
          active: true,
        },
      })
      res.status(201).json({ data: alert })
    } catch (err) {
      next(err)
    }
  },
)

routeAlertsRouter.delete('/:id', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    await prisma.routeAlert.deleteMany({
      where: { id: req.params['id'] ?? '', userId: req.userId! },
    })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})
