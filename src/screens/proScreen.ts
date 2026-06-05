import { renderButton } from '@/components/Button'
import { renderChip, renderChipRow } from '@/components/Chip'
import { mountTopBar } from '@/components/TopBar'
import { showToast } from '@/components/toast'
import type { ScreenRenderContext } from '@/app/screenRegistry'

let selectedPlan: 'monthly' | 'annual' = 'annual'

const BENEFITS = [
  'Unlimited ride posts',
  'Recurring auto-posts',
  'Pro driver badge',
  'Priority support',
]

export function renderProScreen({ container }: ScreenRenderContext): void {
  mountTopBar({ title: 'COMMUTR Pro', showBack: true, backGo: 'profile' })

  container.className = 'cm-screen'
  container.innerHTML = `
    <div class="cm-stack cm-stack--lg">
      <section>
        <h1 class="cm-display-lg">Drive more with Pro</h1>
        <p class="cm-body cm-muted cm-mt-2">Passengers are always free. No passenger booking fees.</p>
      </section>

      <section class="cm-card cm-card--pad">
        ${BENEFITS.map((b) => `<div class="cm-pro-benefit"><div class="cm-pro-benefit__icon">✓</div><p class="cm-body">${b}</p></div>`).join('')}
      </section>

      ${renderChipRow(
        [
          renderChip('Monthly $4.99', {
            pressed: selectedPlan === 'monthly',
            action: 'plan-pick',
            value: 'monthly',
          }),
          renderChip('Annual $39.99 · Save 33%', {
            pressed: selectedPlan === 'annual',
            action: 'plan-pick',
            value: 'annual',
          }),
        ].join(''),
      )}

      ${renderButton('Upgrade to Pro', { variant: 'primary', block: true, action: 'pro-upgrade' })}
      <p class="cm-caption cm-muted cm-text-center">Driver upgrade only. Cancel anytime.</p>
    </div>`

  container.querySelectorAll('[data-action="plan-pick"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedPlan = ((btn as HTMLElement).dataset['chipValue'] ?? 'annual') as 'monthly' | 'annual'
      renderProScreen({ container })
    })
  })

  container.querySelector('[data-action="pro-upgrade"]')?.addEventListener('click', () => {
    showToast('Pro upgrade is managed from your account settings')
  })
}
