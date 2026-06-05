import { byId, qsa, screenElement } from './dom'
import { loadRideDetail } from '@/screens/rideDetailScreen'
import { initSearchScreen } from '@/screens/searchScreen'

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

const screenHooks: Partial<Record<ScreenId, () => void>> = {
  search: () => initSearchScreen(),
  detail: () => {
    void loadRideDetail()
  },
}

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
  qsa('.dropdown.open').forEach((el) => el.classList.remove('open'))
  qsa('[data-modal]').forEach((el) => ((el as HTMLElement).style.display = 'none'))
}

export function updateNavState(target: ScreenId): void {
  const mainNav = document.getElementById('xnav')
  const desktnav = document.getElementById('desktnav')
  const noNavScreens: ScreenId[] = ['ob', 'signup', 'sos']

  if (mainNav) {
    mainNav.style.display = noNavScreens.includes(target) ? 'none' : ''
  }
  if (desktnav) {
    desktnav.style.display = noNavScreens.includes(target) ? 'none' : ''
  }

  qsa<HTMLElement>('[data-go]', mainNav ?? document).forEach((link) => {
    const linkTarget = link.dataset['go'] as ScreenId
    link.classList.toggle('active', linkTarget === target)
    link.setAttribute('aria-current', linkTarget === target ? 'page' : 'false')
  })
  qsa<HTMLElement>('[data-go]', desktnav ?? document).forEach((link) => {
    const linkTarget = link.dataset['go'] as ScreenId
    link.classList.toggle('active', linkTarget === target)
  })
}

const ONBOARDING_KEY = 'commutr_onboarding_v1'

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

  SCREEN_IDS.forEach((id) => {
    try {
      screenElement(id).classList.remove('on')
      screenElement(id).style.display = 'none'
    } catch {
      // optional screen
    }
  })

  try {
    const el = screenElement(target)
    el.classList.add('on')
    el.style.display = 'flex'
  } catch {
    console.warn(`Screen not found: ${target}`)
    return
  }

  currentScreen = target
  updateNavState(target)
  syncUrl(target)

  try {
    byId(`s-${target}`).scrollTop = 0
  } catch {
    // ignore
  }

  screenHooks[target]?.()
}
