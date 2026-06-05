import { authService } from '@/services/authService'
import { appStore } from '@/app/store'
import { isDemoExperience } from '@/config/runtime'
import { go, type ScreenId } from '@/utils/router'
import { renderButton } from '@/components/Button'
import { mountTopBar } from '@/components/TopBar'
import { iconChevronRight } from '@/components/icons'
import { showToast } from '@/components/toast'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import { escapeHtml } from '@/utils/dom'

const GROUPS = [
  {
    title: 'Appearance',
    rows: [{ title: 'Theme', sub: 'Dark (only)', go: '', disabled: true }],
  },
  {
    title: 'Account',
    rows: [
      { title: 'Personal info', sub: 'Name, email, phone', go: 'signup' },
      { title: 'Emergency contact', sub: 'Not set', go: 'sos' },
    ],
  },
  {
    title: 'Notifications',
    rows: [{ title: 'Push & email', sub: 'Seat requests, reminders', go: 'notifs' }],
  },
  {
    title: 'Privacy & Safety',
    rows: [
      { title: 'Blocked users', sub: 'Manage blocks', go: 'settings' },
      { title: 'Share trip defaults', sub: 'On after confirmation', go: 'settings' },
    ],
  },
  {
    title: 'Verification',
    rows: [{ title: 'ID verification', sub: 'Verified', go: 'profile' }],
  },
  {
    title: 'Subscription',
    rows: [{ title: 'COMMUTR Pro', sub: 'Active · Renews Apr 12', go: 'sub' }],
  },
  {
    title: 'Support',
    rows: [
      { title: 'Help centre', sub: 'FAQs and contact', go: 'settings' },
      { title: 'Report an issue', sub: 'Safety or app problems', go: 'sos' },
    ],
  },
  {
    title: 'Legal',
    rows: [
      { title: 'Terms of service', sub: '', go: 'settings' },
      { title: 'Privacy policy', sub: '', go: 'settings' },
    ],
  },
]

export function renderSettingsScreen({ container }: ScreenRenderContext): void {
  mountTopBar({ title: 'Settings', showBack: true, backGo: 'profile' })

  container.className = 'cm-screen'
  container.innerHTML = `
    <div class="cm-stack cm-stack--lg">
      ${GROUPS.map(
        (g) => `
        <section>
          <h3 class="cm-micro cm-muted cm-mb-4">${escapeHtml(g.title)}</h3>
          <div class="cm-card cm-card--flat">
            ${g.rows
              .map((r) => {
                const disabled = 'disabled' in r && r.disabled
                return `
              <button type="button" class="cm-settings-row${disabled ? ' cm-settings-row--disabled' : ''}" data-go="${r.go}" ${disabled ? 'disabled aria-disabled="true"' : ''}>
                <div class="cm-settings-row__body">
                  <div class="cm-settings-row__title">${escapeHtml(r.title)}</div>
                  ${r.sub ? `<div class="cm-settings-row__sub">${escapeHtml(r.sub)}</div>` : ''}
                </div>
                <span class="cm-settings-row__chevron" aria-hidden="true">${iconChevronRight()}</span>
              </button>`
              })
              .join('')}
          </div>
        </section>`,
      ).join('')}
      ${renderButton('Sign out', { variant: 'danger', block: true, action: 'sign-out' })}
    </div>`

  container.querySelectorAll('.cm-settings-row:not([disabled])').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = (btn as HTMLElement).dataset['go']
      if (target) go(target as ScreenId)
    })
  })

  container.querySelector('.cm-settings-row--disabled')?.addEventListener('click', () => {
    showToast('Light mode is not available yet — Commutr is dark-first for now.')
  })

  container.querySelector('[data-action="sign-out"]')?.addEventListener('click', () => {
    void authService.logout().then(() => {
      if (isDemoExperience()) {
        const guest = authService.continueAsGuest()
        appStore.setUser({
          id: guest.id,
          name: guest.name,
          email: guest.email,
          verified: guest.verified,
        })
        go('home')
        return
      }
      go('signup')
    })
  })
}
