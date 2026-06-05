import { chatService } from '@/services/chatService'
import { getDemoRideById } from '@/config/demoData'
import { appStore } from '@/app/store'
import { mountTopBar } from '@/components/TopBar'
import { renderBadge } from '@/components/Badge'
import { renderButton } from '@/components/Button'
import { iconSend } from '@/components/icons'
import type { Ride } from '@/contracts/types/Ride'
import type { Message } from '@/contracts/types/Message'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import { escapeHtml } from '@/utils/dom'
import { go } from '@/utils/router'

export function renderChatScreen({ container }: ScreenRenderContext): void {
  const convId = appStore.getActiveConversationId() ?? 'demo-conv-1'
  appStore.setActiveConversationId(convId)

  void loadChat(container, convId)
}

async function loadChat(container: HTMLElement, convId: string): Promise<void> {
  const conv = await chatService.getConversation(convId)
  const title = conv?.participantName ?? 'Chat'
  const route = conv?.routeLabel ?? 'Route'
  const rideId = conv?.rideId ?? 'demo-lon-tor-1'
  const ride = getDemoRideById(rideId)

  mountTopBar({
    title,
    subtitle: route,
    showBack: true,
    backGo: 'inbox',
  })

  container.className = 'cm-screen cm-screen--full'
  container.innerHTML = `
    ${ride ? pinnedRideHtml(ride) : ''}
    <div class="cm-message-list" id="chat-messages" role="log" aria-live="polite"></div>
    <div class="cm-chat-composer">
      <input id="chat-input" class="cm-input cm-chat-input" type="text" placeholder="Message…" autocomplete="off" />
      <button type="button" class="cm-icon-button cm-chat-send-icon" data-action="send-msg" aria-label="Send message">${iconSend()}</button>
    </div>`

  const messages = await chatService.getMessages(convId)
  renderMessages(messages)

  container.querySelector('[data-action="open-pinned-ride"]')?.addEventListener('click', () => {
    if (rideId) {
      appStore.setSelectedRideId(rideId)
      go('detail')
    }
  })
}

function pinnedRideHtml(ride: Ride): string {
  return `
    <div class="cm-pinned-ride">
      <div class="cm-row cm-row--between">
        <div>
          <p class="cm-caption cm-muted">Pinned ride</p>
          <p class="cm-body" style="font-weight:750">${escapeHtml(ride.origin)} → ${escapeHtml(ride.destination)}</p>
        </div>
        ${renderBadge('Seat held', 'success')}
      </div>
      ${renderButton('View ride', { variant: 'outline', action: 'open-pinned-ride' })}
    </div>`
}

function renderMessages(messages: Message[]): void {
  const list = document.getElementById('chat-messages')
  if (!list) return
  list.innerHTML = messages
    .map((m) => {
      const cls =
        m.senderId === 'local-user'
          ? 'cm-message cm-message--mine'
          : m.senderId === 'system'
            ? 'cm-message cm-message--system'
            : 'cm-message cm-message--theirs'
      return `<div class="${cls}">${escapeHtml(m.text)}</div>`
    })
    .join('')
  list.scrollTop = list.scrollHeight
}

export function appendChatMessage(text: string, mine = true): void {
  const list = document.getElementById('chat-messages')
  if (!list) return
  const div = document.createElement('div')
  div.className = mine ? 'cm-message cm-message--mine' : 'cm-message cm-message--theirs'
  div.textContent = text
  list.appendChild(div)
  list.scrollTop = list.scrollHeight
}

export async function persistOutgoingMessage(text: string): Promise<void> {
  const convId = appStore.getActiveConversationId()
  if (!convId) return
  await chatService.sendMessage(convId, text)
}
