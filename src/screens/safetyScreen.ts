import { mountTopBar } from '@/components/TopBar'
import { renderButton } from '@/components/Button'
import { showToast } from '@/components/toast'
import type { ScreenRenderContext } from '@/app/screenRegistry'

export function renderSafetyScreen({ container }: ScreenRenderContext): void {
  mountTopBar({ title: 'Safety', showBack: true, backGo: 'home' })

  container.className = 'cm-screen cm-screen--full'
  container.innerHTML = `
    <div class="cm-stack cm-stack--lg">
      <section class="cm-card cm-card--pad">
        <p class="cm-micro cm-muted">Active ride</p>
        <p class="cm-title-md cm-mt-2">London → Toronto</p>
        <p class="cm-caption cm-muted">Sat 8:00 AM · Priya K.</p>
      </section>

      <section>
        <p class="cm-body cm-muted cm-text-center cm-mb-4">Press and hold for 3 seconds to activate SOS</p>
        <button type="button" class="cm-sos-button" data-action="sos-hold">SOS</button>
      </section>

      <section class="cm-card cm-card--pad cm-stack">
        <h3 class="cm-section-title">Emergency contacts</h3>
        <p class="cm-body">Mom · +1 (519) 555-0100</p>
        ${renderButton('Edit contacts', { variant: 'outline', block: true })}
      </section>

      <section class="cm-stack">
        ${renderButton('Share live location', { variant: 'secondary', block: true, action: 'share-location' })}
        ${renderButton('Call 911', { variant: 'danger', block: true, action: 'call-911' })}
        ${renderButton('Report issue', { variant: 'outline', block: true, action: 'report-issue' })}
      </section>
    </div>`

  bindSafetyEvents(container)
}

function bindSafetyEvents(container: HTMLElement): void {
  const sosBtn = container.querySelector('[data-action="sos-hold"]') as HTMLButtonElement | null
  if (sosBtn) {
    let timer: ReturnType<typeof setTimeout> | null = null
    const start = (): void => {
      timer = setTimeout(() => showToast('SOS activated — emergency contacts notified'), 3000)
    }
    const cancel = (): void => {
      if (timer) clearTimeout(timer)
    }
    sosBtn.addEventListener('mousedown', start)
    sosBtn.addEventListener('mouseup', cancel)
    sosBtn.addEventListener('mouseleave', cancel)
    sosBtn.addEventListener('touchstart', start)
    sosBtn.addEventListener('touchend', cancel)
  }

  container.querySelector('[data-action="call-911"]')?.addEventListener('click', () => {
    showToast('Dial 911 from your phone in an emergency')
  })
}
