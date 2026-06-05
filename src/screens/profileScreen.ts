import { appStore } from '@/app/store'
import { renderButton } from '@/components/Button'
import { renderBadge } from '@/components/Badge'
import { mountTopBar } from '@/components/TopBar'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import { escapeHtml } from '@/utils/dom'

export function renderProfileScreen({ container }: ScreenRenderContext): void {
  const user = appStore.getState().user
  const name = user?.name ?? 'Rudra K.'
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)

  mountTopBar({
    title: 'Profile',
    actions: `<button type="button" class="cm-icon-button" data-go="settings" aria-label="Settings">⚙</button>`,
  })

  container.className = 'cm-screen'
  container.innerHTML = `
    <div class="cm-stack cm-stack--lg">
      <section class="cm-card cm-profile-hero">
        <div class="cm-avatar cm-avatar--lg" style="margin:0 auto var(--cm-space-3)">${escapeHtml(initials)}</div>
        <h1 class="cm-title-lg">${escapeHtml(name)}</h1>
        <p class="cm-body cm-muted">London, ON · Member since 2024</p>
        <div class="cm-chip-row cm-mt-4" style="justify-content:center">
          ${renderBadge('ID verified', 'success')}
          ${renderBadge('Email verified', 'brand')}
        </div>
      </section>

      <section class="cm-card cm-card--pad">
        <div class="cm-stats-grid">
          <div><div class="cm-stats-grid__value">12</div><div class="cm-stats-grid__label">Trips</div></div>
          <div><div class="cm-stats-grid__value">4.9</div><div class="cm-stats-grid__label">Rating</div></div>
          <div><div class="cm-stats-grid__value">8</div><div class="cm-stats-grid__label">Reviews</div></div>
          <div><div class="cm-stats-grid__value">18kg</div><div class="cm-stats-grid__label">CO₂ saved</div></div>
        </div>
      </section>

      <section class="cm-card cm-card--flat">
        ${quickAction('Driver dashboard', 'Manage rides & requests', 'dashboard')}
        ${quickAction('Trip history', 'Past passenger & driver trips', 'history')}
        ${quickAction('Route alerts', 'Get notified for new routes', 'search')}
        ${quickAction('Settings', 'Account, privacy, support', 'settings')}
      </section>

      <section class="cm-card cm-card--pad">
        <h3 class="cm-section-title">Recent review</h3>
        <p class="cm-body">"Great driver, on time and easy to coordinate with."</p>
        <p class="cm-caption cm-muted cm-mt-2">Priya K. · Passenger · Toronto → London</p>
      </section>

      <section class="cm-card cm-card--tinted cm-card--pad">
        <p class="cm-micro cm-muted">Account plan</p>
        <p class="cm-title-md cm-mt-2">COMMUTR Pro</p>
        <p class="cm-caption cm-muted">Renews Apr 12 · Unlimited ride posts</p>
        ${renderButton('Manage subscription', { variant: 'outline', block: true, go: 'sub' })}
      </section>
    </div>`
}

function quickAction(title: string, sub: string, screen: string): string {
  return `
    <button type="button" class="cm-settings-row" data-go="${screen}">
      <div class="cm-settings-row__icon">→</div>
      <div class="cm-settings-row__body">
        <div class="cm-settings-row__title">${escapeHtml(title)}</div>
        <div class="cm-settings-row__sub">${escapeHtml(sub)}</div>
      </div>
      <span aria-hidden="true">›</span>
    </button>`
}
