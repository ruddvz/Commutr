import { renderButton } from '@/components/Button'
import { renderBadge } from '@/components/Badge'
import { renderAvatar } from '@/components/Avatar'
import { mountTopBar } from '@/components/TopBar'
import { showEmpty } from '@/components/uiStates'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import { escapeHtml } from '@/utils/dom'

const PENDING = [
  {
    id: 'req-1',
    name: 'Alex M.',
    route: 'Toronto → Ottawa',
    seats: 1,
    rating: '4.8',
  },
]

export function renderDriverDashboardScreen({ container }: ScreenRenderContext): void {
  mountTopBar({ title: 'Driver dashboard', subtitle: 'Today · 2 rides' })

  container.className = 'cm-screen'
  container.innerHTML = `
    <div class="cm-stack cm-stack--lg">
      <section class="cm-dashboard-stat-row">
        <div class="cm-card cm-card--pad"><p class="cm-caption cm-muted">This month</p><p class="cm-title-md">4 rides</p></div>
        <div class="cm-card cm-card--pad"><p class="cm-caption cm-muted">Rating</p><p class="cm-title-md">4.9 ★</p></div>
      </section>

      <section>
        <h3 class="cm-section-title">Pending requests</h3>
        <div id="pending-requests" class="cm-card-list"></div>
      </section>

      <section>
        <h3 class="cm-section-title">Active rides</h3>
        <div class="cm-card cm-card--pad">
          <p class="cm-body" style="font-weight:750">Toronto → Ottawa</p>
          <p class="cm-caption cm-muted">Sat · 2 of 3 seats filled · 1 pending</p>
          <div class="cm-row cm-mt-4 cm-gap-2">
            ${renderButton('Edit', { variant: 'outline' })}
            ${renderButton('Manage', { variant: 'secondary', go: 'detail' })}
          </div>
        </div>
      </section>

      <section class="cm-card cm-card--pad">
        <h3 class="cm-section-title">Performance</h3>
        <div class="cm-stats-grid">
          <div><div class="cm-stats-grid__value">28</div><div class="cm-stats-grid__label">Rides</div></div>
          <div><div class="cm-stats-grid__value">64</div><div class="cm-stats-grid__label">Passengers</div></div>
          <div><div class="cm-stats-grid__value">$420</div><div class="cm-stats-grid__label">Fuel recovered</div></div>
          <div><div class="cm-stats-grid__value">4.9</div><div class="cm-stats-grid__label">Rating</div></div>
        </div>
      </section>

      ${renderButton('Upgrade to COMMUTR Pro', { variant: 'secondary', block: true, go: 'sub' })}
    </div>`

  renderPending(container)
}

function renderPending(container: HTMLElement): void {
  const el = container.querySelector('#pending-requests') as HTMLElement
  if (PENDING.length === 0) {
    showEmpty(el, { title: 'No pending requests', body: 'New seat requests will appear here.' })
    return
  }
  el.innerHTML = PENDING.map(
    (r) => `
    <article class="cm-card cm-card--pad">
      <div class="cm-row">
        ${renderAvatar(r.name)}
        <div style="flex:1">
          <p class="cm-body" style="font-weight:750">${escapeHtml(r.name)} · ★ ${escapeHtml(r.rating)}</p>
          <p class="cm-caption cm-muted">${escapeHtml(r.route)} · ${r.seats} seat</p>
        </div>
        ${renderBadge('Request sent', 'warning')}
      </div>
      <div class="cm-row cm-mt-4 cm-gap-2">
        ${renderButton('Decline', { variant: 'outline' })}
        ${renderButton('Accept', { variant: 'primary' })}
      </div>
    </article>`,
  ).join('')
}
