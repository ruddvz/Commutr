import { mountTopBar } from '@/components/TopBar'
import { renderBadge } from '@/components/Badge'
import { renderAvatar } from '@/components/Avatar'
import { renderChip, renderChipRow } from '@/components/Chip'
import { showEmpty } from '@/components/uiStates'
import { go } from '@/utils/router'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import { iconSearch } from '@/components/icons'
import { escapeHtml } from '@/utils/dom'

const CONVERSATIONS = [
  {
    id: '1',
    name: 'Priya K.',
    route: 'London → Toronto',
    lastMessage: 'See you at Masonville Mall at 8.',
    time: '2m',
    unread: 2,
    status: 'Seat held',
  },
  {
    id: '2',
    name: 'Marcus T.',
    route: 'Toronto → Ottawa',
    lastMessage: 'Request sent',
    time: '1h',
    unread: 0,
    status: 'Request sent',
  },
]

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
  renderInboxList(container)
}

function bindInboxEvents(container: HTMLElement): void {
  container.querySelectorAll('[data-action="inbox-filter"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      inboxFilter = (btn as HTMLElement).dataset['chipValue'] ?? 'All'
      renderInboxScreen({ container })
    })
  })
}

function renderInboxList(container: HTMLElement): void {
  const list = container.querySelector('#inbox-list') as HTMLElement
  const filtered =
    inboxFilter === 'All'
      ? CONVERSATIONS
      : CONVERSATIONS.filter((c) =>
          inboxFilter === 'Seat requests'
            ? c.status === 'Request sent'
            : inboxFilter === 'Confirmed'
              ? c.status === 'Seat held'
              : false,
        )

  if (filtered.length === 0) {
    showEmpty(list, {
      title: 'No messages yet',
      body: 'When you message a driver or receive seat requests, conversations appear here.',
      actionLabel: 'Search rides',
      actionGo: 'search',
    })
    return
  }

  list.innerHTML = filtered
    .map(
      (c) => `
      <article class="cm-card cm-conversation-card" data-action="open-chat" data-chat-id="${escapeHtml(c.id)}" tabindex="0">
        ${renderAvatar(c.name)}
        <div style="flex:1;min-width:0">
          <div class="cm-row cm-row--between">
            <span class="cm-body" style="font-weight:750">${escapeHtml(c.name)}</span>
            <span class="cm-caption cm-muted">${escapeHtml(c.time)}</span>
          </div>
          <p class="cm-caption cm-muted">${escapeHtml(c.route)}</p>
          <p class="cm-body">${escapeHtml(c.lastMessage)}</p>
          <div class="cm-mt-2">${renderBadge(c.status, c.status === 'Seat held' ? 'success' : 'warning')}</div>
        </div>
        ${c.unread > 0 ? `<span class="cm-badge cm-badge--brand">${c.unread}</span>` : ''}
      </article>`,
    )
    .join('')

  list.querySelectorAll('[data-action="open-chat"]').forEach((el) => {
    el.addEventListener('click', () => go('chat'))
  })
}
