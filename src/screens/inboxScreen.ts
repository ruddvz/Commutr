import { chatService } from '@/services/chatService'
import { appStore } from '@/app/store'
import { go } from '@/utils/router'
import { renderBadge } from '@/components/Badge'
import { renderAvatar } from '@/components/Avatar'
import { renderChip, renderChipRow } from '@/components/Chip'
import { mountTopBar } from '@/components/TopBar'
import { iconSearch } from '@/components/icons'
import { showEmpty } from '@/components/uiStates'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import { escapeHtml } from '@/utils/dom'

let inboxFilter = 'All'

export function renderInboxScreen({ container }: ScreenRenderContext): void {
  mountTopBar({
    title: 'Messages',
    actions: `<button type="button" class="cm-icon-button" aria-label="Search messages">${iconSearch()}</button>`,
  })

  container.className = 'cm-screen'
  container.innerHTML = `
    ${renderChipRow(['All', 'Seat requests', 'Confirmed', 'Alerts'].map((f) => renderChip(f, { pressed: inboxFilter === f, action: 'inbox-filter', value: f })).join(''))}
    <div id="inbox-list" class="cm-card-list cm-mt-4"></div>`

  bindInboxEvents(container)
  void loadInbox(container)
}

function bindInboxEvents(container: HTMLElement): void {
  container.querySelectorAll('[data-action="inbox-filter"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      inboxFilter = (btn as HTMLElement).dataset['chipValue'] ?? 'All'
      renderInboxScreen({ container })
    })
  })
}

async function loadInbox(container: HTMLElement): Promise<void> {
  const el = container.querySelector('#inbox-list') as HTMLElement
  if (!el) return

  try {
    const conversations = await chatService.getConversations()
    const filtered =
      inboxFilter === 'All'
        ? conversations
        : conversations.filter((c) => {
            if (inboxFilter === 'Seat requests') return c.unreadCount > 0
            if (inboxFilter === 'Confirmed') return c.rideId
            return true
          })

    if (filtered.length === 0) {
      showEmpty(el, {
        title: 'No messages yet',
        body: 'When you request a seat or a rider contacts you, chats will appear here.',
        actionLabel: 'Find rides',
        actionGo: 'search',
      })
      return
    }

    el.innerHTML = filtered
      .map((c) => {
        const last = c.lastMessage?.text ?? 'Start the conversation'
        const time = formatRelative(c.updatedAt)
        return `
      <article class="cm-card cm-conversation-card" data-action="open-chat" data-chat-id="${escapeHtml(c.id)}" tabindex="0">
        <div class="cm-row">
          ${renderAvatar(c.participantName)}
          <div style="flex:1;min-width:0">
            <div class="cm-row cm-row--between">
              <span class="cm-body" style="font-weight:750">${escapeHtml(c.participantName)}</span>
              <span class="cm-caption cm-muted">${escapeHtml(time)}</span>
            </div>
            <p class="cm-caption cm-muted">${escapeHtml(c.routeLabel)}</p>
            <p class="cm-body cm-truncate">${escapeHtml(last)}</p>
          </div>
          ${c.unreadCount > 0 ? renderBadge(String(c.unreadCount), 'brand') : ''}
        </div>
      </article>`
      })
      .join('')

    el.querySelectorAll<HTMLElement>('[data-action="open-chat"]').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.dataset['chatId']
        if (id) {
          appStore.setActiveConversationId(id)
          go('chat')
        }
      })
    })
  } catch {
    showEmpty(el, {
      title: 'No messages yet',
      body: 'When you request a seat or a rider contacts you, chats will appear here.',
      actionLabel: 'Find rides',
      actionGo: 'search',
    })
  }
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${Math.max(1, mins)}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}
