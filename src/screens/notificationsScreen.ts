import { mountTopBar } from '@/components/TopBar'
import { renderBadge } from '@/components/Badge'
import { showEmpty } from '@/components/uiStates'
import { go } from '@/utils/router'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import { iconCheck, iconInfo, iconStar } from '@/components/icons'
import { escapeHtml } from '@/utils/dom'

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'success',
    title: 'Seat request accepted',
    body: 'Priya accepted your London → Toronto request.',
    time: '2m ago',
    route: 'London → Toronto',
    unread: true,
  },
  {
    id: '2',
    type: 'info',
    title: 'New seat request',
    body: 'Alex requested 1 seat on your Toronto → Ottawa ride.',
    time: '1h ago',
    route: 'Toronto → Ottawa',
    unread: true,
  },
  {
    id: '3',
    type: 'brand',
    title: 'Route alert match',
    body: 'A new Windsor → Toronto ride was posted.',
    time: 'Yesterday',
    route: 'Windsor → Toronto',
    unread: false,
  },
]

export function renderNotificationsScreen({ container }: ScreenRenderContext): void {
  mountTopBar({ title: 'Notifications', showBack: true, backGo: 'home' })

  container.className = 'cm-screen'
  container.innerHTML = `<div id="notif-list" class="cm-card-list"></div>`
  renderNotifs(container)
}

function renderNotifs(container: HTMLElement): void {
  const list = container.querySelector('#notif-list') as HTMLElement
  if (NOTIFICATIONS.length === 0) {
    showEmpty(list, {
      title: 'No notifications',
      body: 'Updates about rides, messages, and alerts appear here.',
    })
    return
  }

  list.innerHTML = NOTIFICATIONS.map(
    (n) => `
    <article class="cm-card cm-notif-card${n.unread ? ' cm-notif-card--unread' : ''}" data-go="inbox" tabindex="0">
      <div class="cm-settings-row__icon">${iconFor(n.type)}</div>
      <div style="flex:1">
        <div class="cm-row cm-row--between">
          <p class="cm-body" style="font-weight:750">${escapeHtml(n.title)}</p>
          <span class="cm-caption cm-muted">${escapeHtml(n.time)}</span>
        </div>
        <p class="cm-caption">${escapeHtml(n.body)}</p>
        <div class="cm-mt-2">${renderBadge(n.route, 'brand')}</div>
      </div>
    </article>`,
  ).join('')

  list.querySelectorAll('[data-go]').forEach((el) => {
    el.addEventListener('click', () => go('inbox'))
  })
}

function iconFor(type: string): string {
  if (type === 'success') return iconCheck()
  if (type === 'info') return iconInfo()
  return iconStar()
}
