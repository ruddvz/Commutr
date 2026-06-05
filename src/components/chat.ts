import { appendChatMessage, persistOutgoingMessage } from '@/screens/chatScreen'

export function openChat(_userId: string): void {
  scrollChatToEnd()
}

export function addEmoji(emoji: string): void {
  const input = document.getElementById('chat-input') as HTMLInputElement | null
  if (!input) return
  input.value += emoji
  input.focus()
}

export function sendMsg(): void {
  const input = document.getElementById('chat-input') as HTMLInputElement | null
  if (!input) return
  const text = input.value.trim()
  if (!text) return

  appendChatMessage(text, true)
  input.value = ''
  void persistOutgoingMessage(text)
  scrollChatToEnd()
}

export function scrollChatToEnd(): void {
  const feed = document.getElementById('chat-messages') ?? document.getElementById('chat-feed')
  if (!feed) return
  feed.scrollTop = feed.scrollHeight
}

export function bindMessageButtons(): void {
  const input = document.getElementById('chat-input') as HTMLInputElement | null
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMsg()
    }
  })
}
