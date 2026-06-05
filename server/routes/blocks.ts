import { Router } from 'express'
import { z } from 'zod'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { AppError } from '../middleware/errorHandler.js'
import { prisma } from '../db/client.js'

export const blocksRouter = Router()

const blockSchema = z.object({
  blockedId: z.string().uuid(),
})

blocksRouter.post(
  '/',
  requireAuth,
  validateBody(blockSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { blockedId } = req.body as z.infer<typeof blockSchema>
      if (blockedId === req.userId) {
        throw new AppError(400, 'Cannot block yourself', 'VALIDATION_ERROR')
      }
      const block = await prisma.block.upsert({
        where: { blockerId_blockedId: { blockerId: req.userId!, blockedId } },
        update: {},
        create: { blockerId: req.userId!, blockedId },
      })
      res.status(201).json({ data: block })
    } catch (err) {
      next(err)
    }
  },
)

blocksRouter.delete('/:userId', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    await prisma.block.deleteMany({
      where: { blockerId: req.userId!, blockedId: req.params['userId'] ?? '' },
    })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})
