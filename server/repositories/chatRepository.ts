import { prisma } from '../db/client.js'
import type { Conversation, Message } from '../../src/contracts/types/Message.js'

function toMessageDto(row: {
  id: string
  conversationId: string
  senderId: string
  text: string
  read: boolean
  sentAt: Date
}): Message {
  return {
    id: row.id,
    conversationId: row.conversationId,
    senderId: row.senderId,
    text: row.text,
    read: row.read,
    sentAt: row.sentAt.toISOString(),
  }
}

function toConversationDto(
  row: {
    id: string
    rideId: string | null
    seatRequestId: string | null
    lastMessageAt: Date
    createdAt: Date
  },
  participantIds: string[],
  lastMessage?: Message,
): Conversation {
  return {
    id: row.id,
    participantIds,
    rideId: row.rideId ?? undefined,
    seatRequestId: row.seatRequestId ?? undefined,
    lastMessage,
    updatedAt: row.lastMessageAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  }
}

export const chatRepository = {
  async listConversations(userId: string): Promise<Conversation[]> {
    const rows = await prisma.conversation.findMany({
      where: { participants: { some: { userId } } },
      include: {
        participants: true,
        messages: { orderBy: { sentAt: 'desc' }, take: 1 },
      },
      orderBy: { lastMessageAt: 'desc' },
    })

    return rows.map((row) =>
      toConversationDto(
        row,
        row.participants.map((p) => p.userId),
        row.messages[0] ? toMessageDto(row.messages[0]) : undefined,
      ),
    )
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const rows = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { sentAt: 'asc' },
    })
    return rows.map(toMessageDto)
  },

  async userInConversation(conversationId: string, userId: string): Promise<boolean> {
    const count = await prisma.conversationParticipant.count({
      where: { conversationId, userId },
    })
    return count > 0
  },

  async findOrCreateConversation(params: {
    participantIds: string[]
    rideId?: string
    seatRequestId?: string
  }): Promise<Conversation> {
    const sorted = [...params.participantIds].sort()

    const existing = await prisma.conversation.findMany({
      where: {
        participants: { every: { userId: { in: sorted } } },
        AND: sorted.map((userId) => ({
          participants: { some: { userId } },
        })),
      },
      include: { participants: true, messages: { orderBy: { sentAt: 'desc' }, take: 1 } },
    })

    const exact = existing.find((c) => {
      const ids = c.participants.map((p) => p.userId).sort()
      return ids.length === sorted.length && ids.every((id, i) => id === sorted[i])
    })

    if (exact) {
      return toConversationDto(
        exact,
        exact.participants.map((p) => p.userId),
        exact.messages[0] ? toMessageDto(exact.messages[0]) : undefined,
      )
    }

    const created = await prisma.conversation.create({
      data: {
        rideId: params.rideId,
        seatRequestId: params.seatRequestId,
        participants: {
          create: sorted.map((userId) => ({ userId })),
        },
      },
      include: { participants: true },
    })

    return toConversationDto(
      created,
      created.participants.map((p) => p.userId),
    )
  },

  async addMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
    const message = await prisma.message.create({
      data: { conversationId, senderId, text },
    })
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: message.sentAt },
    })
    return toMessageDto(message)
  },
}
