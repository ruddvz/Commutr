import type { Conversation, Message } from '@/contracts/types/Message'
import { storageGet, storageSet } from '@/utils/storage'

const CONVERSATIONS_KEY = 'commutr_demo_conversations'
const MESSAGES_KEY = 'commutr_demo_messages'

export type DemoConversation = Conversation & {
  participantName: string
  routeLabel: string
  unreadCount: number
}

function seedConversations(): DemoConversation[] {
  const now = Date.now()
  return [
    {
      id: 'demo-conv-1',
      participantIds: ['demo-driver-1', 'local-user'],
      rideId: 'demo-lon-tor-1',
      participantName: 'Priya K.',
      routeLabel: 'London → Toronto',
      unreadCount: 2,
      updatedAt: new Date(now - 120000).toISOString(),
      createdAt: new Date(now - 86400000).toISOString(),
    },
    {
      id: 'demo-conv-2',
      participantIds: ['demo-driver-3', 'local-user'],
      rideId: 'demo-tor-mtl-1',
      participantName: 'Marcus T.',
      routeLabel: 'Toronto → Montréal',
      unreadCount: 0,
      updatedAt: new Date(now - 3600000).toISOString(),
      createdAt: new Date(now - 172800000).toISOString(),
    },
  ]
}

function seedMessages(): Message[] {
  const now = Date.now()
  return [
    {
      id: 'msg-1',
      conversationId: 'demo-conv-1',
      senderId: 'system',
      text: 'Seat request accepted · Seat held for 1h 58m',
      sentAt: new Date(now - 7200000).toISOString(),
      read: true,
    },
    {
      id: 'msg-2',
      conversationId: 'demo-conv-1',
      senderId: 'demo-driver-1',
      text: 'Hi! I can pick you up at Masonville Mall.',
      sentAt: new Date(now - 3600000).toISOString(),
      read: true,
    },
    {
      id: 'msg-3',
      conversationId: 'demo-conv-1',
      senderId: 'local-user',
      text: "Perfect — I'll be near the main entrance.",
      sentAt: new Date(now - 3500000).toISOString(),
      read: true,
    },
    {
      id: 'msg-4',
      conversationId: 'demo-conv-1',
      senderId: 'demo-driver-1',
      text: 'Great. Cash or e-transfer works for me.',
      sentAt: new Date(now - 120000).toISOString(),
      read: false,
    },
    {
      id: 'msg-5',
      conversationId: 'demo-conv-2',
      senderId: 'local-user',
      text: 'Request sent for 1 seat',
      sentAt: new Date(now - 3600000).toISOString(),
      read: true,
    },
  ]
}

export function getDemoConversations(): DemoConversation[] {
  return storageGet<DemoConversation[]>(CONVERSATIONS_KEY) ?? seedConversations()
}

export function getDemoMessages(conversationId: string): Message[] {
  const all = storageGet<Message[]>(MESSAGES_KEY) ?? seedMessages()
  if (!storageGet<Message[]>(MESSAGES_KEY)) storageSet(MESSAGES_KEY, all)
  return all.filter((m) => m.conversationId === conversationId)
}

export function saveDemoMessage(message: Message): void {
  const all = storageGet<Message[]>(MESSAGES_KEY) ?? seedMessages()
  all.push(message)
  storageSet(MESSAGES_KEY, all)

  const convs = getDemoConversations()
  const idx = convs.findIndex((c) => c.id === message.conversationId)
  if (idx >= 0) {
    convs[idx] = {
      ...convs[idx]!,
      lastMessage: message,
      updatedAt: message.sentAt,
    }
    storageSet(CONVERSATIONS_KEY, convs)
  }
}

export function getDemoConversation(id: string): DemoConversation | undefined {
  return getDemoConversations().find((c) => c.id === id)
}
