import { byId, qsa, screenElement } from './dom'

export const SCREEN_IDS = [
  'ob', 'signup', 'home', 'search', 'post', 'detail', 'chat',
  'inbox', 'profile', 'dashboard', 'notifs', 'history', 'settings', 'sos', 'sub',
] as const

export type ScreenId = (typeof SCREEN_IDS)[number]

let currentScreen: ScreenId = 'ob'

export function getCurrentScreen(): ScreenId {
  return currentScreen
}

export function closeTransientUi(): void {
  // Close any open dropdowns or overlays
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

  // Active state on nav links
  qsa<HTMLAnchorElement>('[data-go]', mainNav ?? document).forEach((link) => {
    const linkTarget = link.dataset['go'] as ScreenId
    link.classList.toggle('active', linkTarget === target)
  })
  qsa<HTMLAnchorElement>('[data-go]', desktnav ?? document).forEach((link) => {
    const linkTarget = link.dataset['go'] as ScreenId
    link.classList.toggle('active', linkTarget === target)
  })
}

export function go(target: ScreenId): void {
  closeTransientUi()

  // Hide all screens
  SCREEN_IDS.forEach((id) => {
    try {
    screenElement(id).classList.remove('on')
    screenElement(id).style.display = 'none'
  } catch {
    // Screen element may not exist in DOM yet
  }
})

// Show target screen
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

  // Scroll to top
  try {
    byId(`s-${target}`).scrollTop = 0
  } catch {
    // ignore
  }
}
