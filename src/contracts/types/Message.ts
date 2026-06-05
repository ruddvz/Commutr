export interface Message {
  id: string
  conversationId: string
  senderId: string
  text: string
  sentAt: string
  read: boolean
}

export interface Conversation {
  id: string
  participantIds: string[]
  rideId?: string
  seatRequestId?: string
  lastMessage?: Message
  updatedAt: string
  createdAt?: string
}
