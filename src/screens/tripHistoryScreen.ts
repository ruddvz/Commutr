import { mountTopBar } from '@/components/TopBar'
import { renderChip, renderChipRow } from '@/components/Chip'
import { renderBadge } from '@/components/Badge'
import { showEmpty } from '@/components/uiStates'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import { escapeHtml } from '@/utils/dom'

let roleFilter: 'Passenger' | 'Driver' = 'Passenger'

const TRIPS = [
  {
    route: 'London → Toronto',
    date: 'Mar 12, 2026',
    partner: 'Priya K.',
    price: '$25',
    role: 'Passenger',
    co2: '4.2 kg',
  },
  {
    route: 'Toronto → Ottawa',
    date: 'Feb 28, 2026',
    partner: 'Alex M.',
    price: '$30',
    role: 'Driver',
    co2: '6.1 kg',
  },
]

export function renderTripHistoryScreen({ container }: ScreenRenderContext): void {
  mountTopBar({ title: 'Trip history', showBack: true, backGo: 'profile' })

  container.className = 'cm-screen'
  container.innerHTML = `
    <div class="cm-history-segment">
      ${renderChipRow(['Passenger', 'Driver'].map((r) => renderChip(r, { pressed: roleFilter === r, action: 'history-role', value: r })).join(''))}
    </div>
    <div class="cm-card cm-card--pad cm-mb-4">
      <p class="cm-caption cm-muted">Summary</p>
      <p class="cm-title-md">12 trips · $280 cost-shared · 18 kg CO₂ saved</p>
    </div>
    <div id="history-list" class="cm-card-list"></div>`

  container.querySelectorAll('[data-action="history-role"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      roleFilter = ((btn as HTMLElement).dataset['chipValue'] ?? 'Passenger') as
        | 'Passenger'
        | 'Driver'
      renderTripHistoryScreen({ container })
    })
  })

  renderHistoryList(container)
}

function renderHistoryList(container: HTMLElement): void {
  const list = container.querySelector('#history-list') as HTMLElement
  const filtered = TRIPS.filter((t) => t.role === roleFilter)
  if (filtered.length === 0) {
    showEmpty(list, {
      title: `No ${roleFilter.toLowerCase()} trips yet`,
      body: 'Completed trips will appear here.',
    })
    return
  }
  list.innerHTML = filtered
    .map(
      (t) => `
      <article class="cm-card cm-card--pad">
        <div class="cm-row cm-row--between">
          <p class="cm-body" style="font-weight:750">${escapeHtml(t.route)}</p>
          ${renderBadge(t.role, 'brand')}
        </div>
        <p class="cm-caption cm-muted">${escapeHtml(t.date)} · ${escapeHtml(t.partner)} · ${escapeHtml(t.price)}</p>
        <p class="cm-caption cm-muted cm-mt-2">Lower CO₂ · ${escapeHtml(t.co2)} saved</p>
      </article>`,
    )
    .join('')
}
