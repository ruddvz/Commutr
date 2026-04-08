import { api } from './api'
import type { Message, Conversation } from '@/contracts/types/Message'

export const chatService = {
  getConversations(): Promise<Conversation[]> {
    return api.get<Conversation[]>('/chat/conversations')
  },

  getMessages(conversationId: string): Promise<Message[]> {
    return api.get<Message[]>(`/chat/conversations/${conversationId}/messages`)
  },

  sendMessage(conversationId: string, text: string): Promise<Message> {
    return api.post<Message>(`/chat/conversations/${conversationId}/messages`, { text })
  },
}
