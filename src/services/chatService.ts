import { api } from './api'
import type { Message, Conversation } from '@/contracts/types/Message'
import { isDemoExperience } from '@/config/runtime'
import {
  getDemoConversation,
  getDemoConversations,
  getDemoMessages,
  saveDemoMessage,
  type DemoConversation,
} from '@/config/demoChatData'

export type ConversationView = DemoConversation

export const chatService = {
  getConversations(): Promise<ConversationView[]> {
    if (isDemoExperience()) return Promise.resolve(getDemoConversations())
    return api.get<ConversationView[]>('/chat/conversations')
  },

  getMessages(conversationId: string): Promise<Message[]> {
    if (isDemoExperience()) return Promise.resolve(getDemoMessages(conversationId))
    return api.get<Message[]>(`/chat/conversations/${conversationId}/messages`)
  },

  sendMessage(conversationId: string, text: string): Promise<Message> {
    if (isDemoExperience()) {
      const message: Message = {
        id: `demo-msg-${Date.now()}`,
        conversationId,
        senderId: 'local-user',
        text,
        sentAt: new Date().toISOString(),
        read: true,
      }
      saveDemoMessage(message)
      return Promise.resolve(message)
    }
    return api.post<Message>(`/chat/conversations/${conversationId}/messages`, { text })
  },

  getConversation(id: string): Promise<ConversationView | undefined> {
    if (isDemoExperience()) return Promise.resolve(getDemoConversation(id))
    return api.get<Conversation>(`/chat/conversations/${id}`).then((c) => c as ConversationView)
  },
}
