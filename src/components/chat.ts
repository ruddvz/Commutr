import { escapeHtml } from '@/utils/dom'
import { showToast } from './toast'

let currentChatTargetId: string | null = null

/**
 * Set the chat context (which conversation is open).
 */
export function openChat(userId: string): void {
  currentChatTargetId = userId
  scrollChatToEnd()
}

/**
 * Append an emoji to the chat input.
 */
export function addEmoji(emoji: string): void {
  const input = document.getElementById('chat-input') as HTMLInputElement | null
  if (!input) return
  input.value += emoji
  input.focus()
}

/**
 * Send the current chat message.
 */
export function sendMsg(): void {
  const input = document.getElementById('chat-input') as HTMLInputElement | null
  if (!input) return
  const text = input.value.trim()
  if (!text) return

  appendMessage(text, 'out')
  input.value = ''
  scrollChatToEnd()
}

function appendMessage(text: string, direction: 'in' | 'out'): void {
  const feed = document.getElementById('chat-feed')
  if (!feed) return

  const div = document.createElement('div')
  div.className = `mwrap b${direction}`
  div.innerHTML = `<span class="msg-bubble">${escapeHtml(text)}</span>`
  feed.appendChild(div)
}

export function scrollChatToEnd(): void {
  const feed = document.getElementById('chat-feed')
  if (!feed) return
  feed.scrollTop = feed.scrollHeight
}

export function bindMessageButtons(): void {
  const sendBtn = document.getElementById('chat-send')
  sendBtn?.addEventListener('click', () => sendMsg())

  const input = document.getElementById('chat-input') as HTMLInputElement | null
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMsg()
    }
  })
}
