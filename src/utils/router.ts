import { byId, qsa } from './dom'
import { getScreenModule } from '@/app/screenRegistry'
import { updateShellNav, screenContainer } from '@/components/AppShell'
import { closeBottomSheet } from '@/components/BottomSheet'
import { authService } from '@/services/authService'

export const SCREEN_IDS = [
  'ob',
  'signup',
  'home',
  'search',
  'post',
  'detail',
  'chat',
  'inbox',
  'profile',
  'dashboard',
  'notifs',
  'history',
  'settings',
  'sos',
  'sub',
  'notfound',
] as const

export type ScreenId = (typeof SCREEN_IDS)[number]

let currentScreen: ScreenId = 'ob'

const ONBOARDING_KEY = 'commutr_onboarding_v1'

export function getCurrentScreen(): ScreenId {
  return currentScreen
}

function screenFromUrl(): ScreenId | null {
  const params = new URLSearchParams(window.location.search)
  const screen = params.get('screen')
  if (!screen) return null
  if (!(SCREEN_IDS as readonly string[]).includes(screen)) return 'notfound'
  return screen as ScreenId
}

function syncUrl(target: ScreenId): void {
  const url = new URL(window.location.href)
  url.searchParams.set('screen', target)
  window.history.replaceState({ screen: target }, '', url)
}

export function closeTransientUi(): void {
  closeBottomSheet()
  qsa('.dropdown.open').forEach((el) => el.classList.remove('open'))
  qsa('[data-modal]').forEach((el) => ((el as HTMLElement).style.display = 'none'))
}

export function updateNavState(target: ScreenId): void {
  updateShellNav(target)
}

export function hasCompletedOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === 'done'
  } catch {
    return false
  }
}

export function markOnboardingComplete(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, 'done')
  } catch {
    // ignore
  }
}

export function getInitialScreen(): ScreenId {
  const fromUrl = screenFromUrl()
  if (fromUrl) return fromUrl
  if (!hasCompletedOnboarding()) return 'ob'
  return 'home'
}

export function go(target: ScreenId): void {
  closeTransientUi()

  const module = getScreenModule(target)
  if (!module) {
    go('notfound')
    return
  }

  if (module.authRequired && !authService.isAuthenticated()) {
    go('signup')
    return
  }

  currentScreen = target
  updateNavState(target)
  syncUrl(target)

  const container = screenContainer()
  container.scrollTop = 0
  container.focus({ preventScroll: true })

  void Promise.resolve(module.render({ container })).catch((err: unknown) => {
    console.error(`Failed to render screen ${target}`, err)
    container.innerHTML = `<div class="cm-card cm-reconnect-card" role="alert"><p class="cm-reconnect-card__title">Could not load screen</p><p class="cm-body cm-muted cm-mt-2">Try again or return home.</p></div>`
  })
}

/** @deprecated Use screenContainer() from AppShell */
export function screenElement(name: string): HTMLElement {
  if (name === getCurrentScreen()) return screenContainer()
  return byId(`legacy-s-${name}`)
}
