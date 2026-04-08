import { qsa } from '@/utils/dom'

/**
 * Scroll-morph: shrink topbar on downscroll, restore on upscroll.
 */
export function bindScrollMorph(): void {
  const scrollAreas = qsa<HTMLElement>('.sa')
  scrollAreas.forEach((sa) => {
    let lastY = 0
    sa.addEventListener(
      'scroll',
      () => {
        const topbar = sa.querySelector<HTMLElement>('.topbar')
        if (!topbar) return
        const down = sa.scrollTop > lastY && sa.scrollTop > 30
        topbar.classList.toggle('compact', down)
        lastY = sa.scrollTop
      },
      { passive: true },
    )
  })
}

/**
 * Compact tabbars when scrolling down inside scroll areas.
 */
export function bindScrollAwareTabbars(): void {
  const scrollAreas = qsa<HTMLElement>('.sa')
  scrollAreas.forEach((sa) => {
    let lastY = 0
    sa.addEventListener(
      'scroll',
      () => {
        const screen = sa.closest('.scr')
        const tabbar = screen?.querySelector<HTMLElement>('.tabbar')
        if (!tabbar) return
        const down = sa.scrollTop > lastY && sa.scrollTop > 60
        tabbar.classList.toggle('compact', down)
        lastY = sa.scrollTop
      },
      { passive: true },
    )
  })
}

/**
 * Desktop nav active state mirrors the mobile tabbar.
 */
export function initDesktopNav(): void {
  const desktnav = document.getElementById('desktnav')
  if (!desktnav) return
  // Active state is managed by router.ts updateNavState
}
