import { Router } from 'express'
import { z } from 'zod'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { AppError } from '../middleware/errorHandler.js'
import { chatRepository } from '../repositories/chatRepository.js'

export const chatRouter = Router()

const createConversationSchema = z.object({
  participantIds: z.array(z.string().uuid()).min(2).max(2),
  rideId: z.string().uuid().optional(),
  seatRequestId: z.string().uuid().optional(),
})

const messageSchema = z.object({
  text: z.string().min(1).max(2000),
})

chatRouter.get('/conversations', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const list = await chatRepository.listConversations(req.userId!)
    res.json({ data: list })
  } catch (err) {
    next(err)
  }
})

chatRouter.post(
  '/conversations',
  requireAuth,
  validateBody(createConversationSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { participantIds, rideId, seatRequestId } = req.body as z.infer<
        typeof createConversationSchema
      >
      if (!participantIds.includes(req.userId!)) {
        throw new AppError(403, 'You must be a participant', 'FORBIDDEN')
      }
      const conversation = await chatRepository.findOrCreateConversation({
        participantIds,
        rideId,
        seatRequestId,
      })
      res.status(201).json({ data: conversation })
    } catch (err) {
      next(err)
    }
  },
)

chatRouter.get('/conversations/:id/messages', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params['id'] ?? ''
    if (!(await chatRepository.userInConversation(id, req.userId!))) {
      throw new AppError(403, 'Forbidden', 'FORBIDDEN')
    }
    const msgs = await chatRepository.getMessages(id)
    res.json({ data: msgs })
  } catch (err) {
    next(err)
  }
})

chatRouter.post(
  '/conversations/:id/messages',
  requireAuth,
  validateBody(messageSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const id = req.params['id'] ?? ''
      if (!(await chatRepository.userInConversation(id, req.userId!))) {
        throw new AppError(403, 'Forbidden', 'FORBIDDEN')
      }
      const { text } = req.body as { text: string }
      const message = await chatRepository.addMessage(id, req.userId!, text.trim())
      res.status(201).json({ data: message })
    } catch (err) {
      next(err)
    }
  },
)
