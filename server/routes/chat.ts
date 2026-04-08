import { Router } from 'express'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { AppError } from '../middleware/errorHandler.js'
import type { Message, Conversation } from '../../src/contracts/types/Message.js'

export const chatRouter = Router()

// In-memory chat store — replace with a DB layer in production
const conversations = new Map<string, Conversation>()
const messages = new Map<string, Message[]>()

chatRouter.get('/conversations', requireAuth, (req: AuthRequest, res) => {
  const userConversations = [...conversations.values()].filter((c) =>
    c.participantIds.includes(req.userId!),
  )
  res.json(userConversations)
})

chatRouter.get('/conversations/:id/messages', requireAuth, (req: AuthRequest, res, next) => {
  const convo = conversations.get(req.params['id'] ?? '')
  if (!convo) {
    next(new AppError(404, 'Conversation not found'))
    return
  }
  if (!convo.participantIds.includes(req.userId!)) {
    next(new AppError(403, 'Forbidden'))
    return
  }
  res.json(messages.get(convo.id) ?? [])
})

chatRouter.post('/conversations/:id/messages', requireAuth, (req: AuthRequest, res, next) => {
  const convo = conversations.get(req.params['id'] ?? '')
  if (!convo) {
    next(new AppError(404, 'Conversation not found'))
    return
  }
  if (!convo.participantIds.includes(req.userId!)) {
    next(new AppError(403, 'Forbidden'))
    return
  }

  const { text } = req.body as { text: string }
  if (!text?.trim()) {
    next(new AppError(400, 'Message text is required'))
    return
  }

  const message: Message = {
    id: crypto.randomUUID(),
    conversationId: convo.id,
    senderId: req.userId!,
    text: text.trim().slice(0, 2000),
    sentAt: new Date().toISOString(),
    read: false,
  }

  const existing = messages.get(convo.id) ?? []
  messages.set(convo.id, [...existing, message])

  const updatedConvo: Conversation = { ...convo, lastMessage: message, updatedAt: message.sentAt }
  conversations.set(convo.id, updatedConvo)

  res.status(201).json(message)
})
