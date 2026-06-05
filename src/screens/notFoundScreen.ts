import { renderButton } from '@/components/Button'
import { mountTopBar } from '@/components/TopBar'
import { go } from '@/utils/router'
import type { ScreenRenderContext } from '@/app/screenRegistry'

export function renderNotFoundScreen({ container }: ScreenRenderContext): void {
  mountTopBar({
    title: 'Not found',
    showBack: true,
    backGo: 'home',
  })

  container.className = 'cm-screen'
  container.innerHTML = `
    <div class="cm-card cm-reconnect-card" role="status">
      <p class="cm-reconnect-card__title">Page not found</p>
      <p class="cm-body cm-muted cm-mt-2">That screen doesn't exist. Head back to discover rides.</p>
      <div class="cm-mt-4">${renderButton('Go Home', { variant: 'primary', go: 'home' })}</div>
    </div>`
}

export function initNotFoundScreen(): void {
  go('home')
}
