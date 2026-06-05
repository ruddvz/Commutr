import { byId, qsa } from './dom'
import { getScreenModule } from '@/app/screenRegistry'
import { updateShellNav, screenContainer } from '@/components/AppShell'
import { closeBottomSheet } from '@/components/BottomSheet'

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
  return (SCREEN_IDS as readonly string[]).includes(screen) ? (screen as ScreenId) : null
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
    console.warn(`Screen module not found: ${target}`)
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
    container.innerHTML = `<div class="cm-empty cm-empty--error" role="alert"><p class="cm-title-md">Could not load screen</p></div>`
  })
}

/** @deprecated Use screenContainer() from AppShell */
export function screenElement(name: string): HTMLElement {
  if (name === getCurrentScreen()) return screenContainer()
  return byId(`legacy-s-${name}`)
}
