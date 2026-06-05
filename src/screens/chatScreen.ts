import { mountTopBar } from '@/components/TopBar'
import { renderBadge } from '@/components/Badge'
import { renderButton } from '@/components/Button'
import type { Ride } from '@/contracts/types/Ride'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import { escapeHtml } from '@/utils/dom'
import { go } from '@/utils/router'

const PINNED_RIDE: Ride = {
  id: 'chat-ride',
  driverId: 'd1',
  driverName: 'Priya K.',
  driverVerified: true,
  driverRating: 4.9,
  origin: 'London, ON',
  destination: 'Toronto, ON',
  departureAt: new Date(Date.now() + 86400000 * 2).toISOString(),
  pricePerSeat: 25,
  seatsAvailable: 2,
  seatsTotal: 3,
  stops: [],
  amenities: [],
  status: 'active',
  createdAt: new Date().toISOString(),
}

const MESSAGES = [
  { type: 'system', text: 'Seat request accepted · Seat held for 1h 58m' },
  { type: 'theirs', text: 'Hi! I can pick you up at Masonville Mall.' },
  { type: 'mine', text: "Perfect — I'll be near the main entrance." },
  { type: 'theirs', text: 'Great. Cash or e-transfer works for me.' },
]

export function renderChatScreen({ container }: ScreenRenderContext): void {
  mountTopBar({
    title: 'Priya K.',
    subtitle: 'London → Toronto',
    showBack: true,
    backGo: 'inbox',
    actions: `<button type="button" class="cm-icon-button" data-action="chat-menu" aria-label="More">⋯</button>`,
  })

  container.className = 'cm-screen cm-screen--full'
  container.innerHTML = `
    <div class="cm-pinned-ride">
      <div class="cm-row cm-row--between">
        <div>
          <p class="cm-caption cm-muted">Pinned ride</p>
          <p class="cm-body" style="font-weight:750">${escapeHtml(PINNED_RIDE.origin)} → ${escapeHtml(PINNED_RIDE.destination)}</p>
        </div>
        ${renderBadge('Seat held', 'success')}
      </div>
      ${renderButton('View ride', { variant: 'outline', action: 'open-pinned-ride' })}
    </div>

    <div class="cm-message-list" id="chat-messages">
      ${MESSAGES.map((m) => {
        const cls =
          m.type === 'mine'
            ? 'cm-message cm-message--mine'
            : m.type === 'system'
              ? 'cm-message cm-message--system'
              : 'cm-message cm-message--theirs'
        return `<div class="${cls}">${escapeHtml(m.text)}</div>`
      }).join('')}
    </div>

    <div class="cm-chat-composer">
      <input id="chat-input" class="cm-input" type="text" placeholder="Message…" style="flex:1" />
      <button type="button" class="cm-icon-button" data-action="add-emoji" data-emoji="👋" aria-label="Add emoji">+</button>
      <button type="button" class="cm-button cm-button--primary" data-action="send-msg" style="min-width:72px">Send</button>
    </div>`

  container
    .querySelector('[data-action="open-pinned-ride"]')
    ?.addEventListener('click', () => go('detail'))
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
