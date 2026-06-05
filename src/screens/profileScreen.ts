import { getDemoUser } from '@/config/demoData'
import { appStore } from '@/app/store'
import { renderButton } from '@/components/Button'
import { renderBadge } from '@/components/Badge'
import { mountTopBar } from '@/components/TopBar'
import { iconSettings, iconChevronRight } from '@/components/icons'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import { escapeHtml } from '@/utils/dom'

export function renderProfileScreen({ container }: ScreenRenderContext): void {
  const stored = appStore.getState().user
  const demo = getDemoUser()
  const name = stored?.name ?? demo.name
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)

  mountTopBar({
    title: 'Profile',
    actions: `<button type="button" class="cm-icon-button" data-go="settings" aria-label="Settings">${iconSettings()}</button>`,
  })

  container.className = 'cm-screen'
  container.innerHTML = `
    <div class="cm-stack cm-stack--lg">
      <section class="cm-card cm-profile-hero">
        <div class="cm-avatar cm-avatar--lg" style="margin:0 auto var(--cm-space-3)">${escapeHtml(initials)}</div>
        <h1 class="cm-title-lg">${escapeHtml(name)}</h1>
        <p class="cm-body cm-muted">${escapeHtml(demo.location)} · Joined ${demo.joinedYear}</p>
        <div class="cm-chip-row cm-mt-4" style="justify-content:center">
          ${renderBadge('Verified rider', 'success')}
          ${renderBadge('Driver profile ready', 'brand')}
        </div>
        ${renderButton('Complete verification', { variant: 'secondary', block: true, go: 'settings' })}
      </section>

      <section class="cm-card cm-card--pad">
        <div class="cm-stats-grid">
          <div><div class="cm-stats-grid__value">${demo.trips}</div><div class="cm-stats-grid__label">Trips</div></div>
          <div><div class="cm-stats-grid__value">${demo.ratingAvg.toFixed(1)}</div><div class="cm-stats-grid__label">Rating</div></div>
          <div><div class="cm-stats-grid__value">${demo.ratingCount}</div><div class="cm-stats-grid__label">Reviews</div></div>
          <div><div class="cm-stats-grid__value">—</div><div class="cm-stats-grid__label">CO₂ saved</div></div>
        </div>
      </section>

      <section class="cm-card cm-card--flat">
        ${quickAction('Driver dashboard', 'Manage rides & requests', 'dashboard')}
        ${quickAction('Trip history', 'Past passenger & driver trips', 'history')}
        ${quickAction('Safety center', 'Guidelines and SOS tools', 'sos')}
        ${quickAction('Settings', 'Account, privacy, support', 'settings')}
      </section>
    </div>`
}

function quickAction(title: string, sub: string, screen: string): string {
  return `
    <button type="button" class="cm-settings-row" data-go="${screen}">
      <div class="cm-settings-row__icon">${iconChevronRight()}</div>
      <div class="cm-settings-row__body">
        <div class="cm-settings-row__title">${escapeHtml(title)}</div>
        <div class="cm-settings-row__sub">${escapeHtml(sub)}</div>
      </div>
      <span class="cm-settings-row__chevron" aria-hidden="true">${iconChevronRight()}</span>
    </button>`
}
