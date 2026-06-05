import { authService } from '@/services/authService'
import { go } from '@/utils/router'
import { renderButton } from '@/components/Button'
import { mountTopBar } from '@/components/TopBar'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import { escapeHtml } from '@/utils/dom'

const GROUPS = [
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
              .map(
                (r) => `
              <button type="button" class="cm-settings-row" data-go="${r.go}">
                <div class="cm-settings-row__body">
                  <div class="cm-settings-row__title">${escapeHtml(r.title)}</div>
                  ${r.sub ? `<div class="cm-settings-row__sub">${escapeHtml(r.sub)}</div>` : ''}
                </div>
                <span aria-hidden="true">›</span>
              </button>`,
              )
              .join('')}
          </div>
        </section>`,
      ).join('')}
      ${renderButton('Sign out', { variant: 'danger', block: true, action: 'sign-out' })}
    </div>`

  container.querySelector('[data-action="sign-out"]')?.addEventListener('click', () => {
    void authService.logout().then(() => go('signup'))
  })
}
