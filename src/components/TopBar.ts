import { escapeHtml } from '@/utils/dom'
import type { ScreenId } from '@/utils/router'
import { iconBack } from './icons'

export type TopBarConfig = {
  title?: string
  subtitle?: string
  showBack?: boolean
  backGo?: ScreenId
  actions?: string
}

export function renderTopBar(config: TopBarConfig): string {
  const back = config.showBack
    ? `<button type="button" class="cm-icon-button cm-focus-ring" data-go="${config.backGo ?? 'home'}" aria-label="Go back">${iconBack()}</button>`
    : ''
  const titleBlock =
    config.title || config.subtitle
      ? `<div>
          ${config.title ? `<div class="cm-topbar__title">${escapeHtml(config.title)}</div>` : ''}
          ${config.subtitle ? `<div class="cm-topbar__subtitle">${escapeHtml(config.subtitle)}</div>` : ''}
        </div>`
      : '<div class="cm-topbar__title">Commutr</div>'

  return `
    <header id="appTopBar" class="cm-topbar">
      <div class="cm-topbar__left">
        ${back}
        ${titleBlock}
      </div>
      <div class="cm-topbar__actions">${config.actions ?? ''}</div>
    </header>`
}

export function mountTopBar(config: TopBarConfig): void {
  const el = document.getElementById('appTopBar')
  if (!el) return
  el.outerHTML = renderTopBar(config)
  initTopBarScroll()
}

function initTopBarScroll(): void {
  const topbar = document.getElementById('appTopBar')
  const screen = document.getElementById('appScreen')
  if (!topbar || !screen) return

  screen.addEventListener(
    'scroll',
    () => {
      topbar.classList.toggle('is-scrolled', screen.scrollTop > 8)
    },
    { passive: true },
  )
}
