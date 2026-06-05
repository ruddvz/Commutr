import { mountBottomNav, mountDesktopNav } from './BottomNav'
import type { ScreenId } from '@/utils/router'

const NO_NAV: ScreenId[] = ['ob', 'signup', 'sos']

export function initAppShell(): void {
  const app = document.getElementById('app')
  if (!app) return

  if (!document.getElementById('appScreen')) {
    app.innerHTML = `
      <header id="appTopBar" class="cm-topbar"></header>
      <main id="appScreen" class="cm-screen" tabindex="-1"></main>
      <nav id="appBottomNav" class="cm-bottom-nav" aria-label="Primary"></nav>`
  }

  if (!document.getElementById('toastRoot')) {
    const toastRoot = document.createElement('div')
    toastRoot.id = 'toastRoot'
    toastRoot.innerHTML = '<div id="toast" class="cm-toast" role="status" aria-live="polite"></div>'
    document.body.append(toastRoot)
  }

  if (!document.getElementById('sheetRoot')) {
    const sheetRoot = document.createElement('div')
    sheetRoot.id = 'sheetRoot'
    document.body.append(sheetRoot)
  }

  if (!document.getElementById('modalRoot')) {
    const modalRoot = document.createElement('div')
    modalRoot.id = 'modalRoot'
    document.body.append(modalRoot)
  }
}

export function updateShellNav(screen: ScreenId): void {
  const app = document.getElementById('app')
  const bottomNav = document.getElementById('appBottomNav')
  const hideNav = NO_NAV.includes(screen)

  app?.classList.toggle('cm-app-shell--no-nav', hideNav)

  if (bottomNav) {
    bottomNav.style.display = hideNav ? 'none' : ''
  }

  if (!hideNav) {
    mountBottomNav(screen)
    mountDesktopNav(screen)
  }
}

export function screenContainer(): HTMLElement {
  const el = document.getElementById('appScreen')
  if (!el) throw new Error('#appScreen not found')
  return el
}

export function renderStickyActions(html: string): string {
  return `<div class="cm-sticky-bar cm-sticky-bar--above-nav">${html}</div>`
}
