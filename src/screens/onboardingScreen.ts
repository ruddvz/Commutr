import { renderButton } from '@/components/Button'
import { renderBadge } from '@/components/Badge'
import { renderRouteTimeline } from '@/components/RouteTimeline'
import { mountTopBar } from '@/components/TopBar'
import { go, markOnboardingComplete } from '@/utils/router'
import type { ScreenRenderContext } from '@/app/screenRegistry'

let obIndex = 0
const SLIDES = [
  {
    title: 'Find a seat without booking fees.',
    body: 'COMMUTR connects riders and drivers on intercity routes across Canada. Message directly, agree on pickup, and split trip costs without platform markup.',
    pill: 'No booking fees',
  },
  {
    title: 'Message the driver. Go.',
    body: 'Direct chat keeps coordination simple — pickup notes, seat holds, and trip updates stay in one place.',
    pill: 'Direct chat',
  },
  {
    title: 'Built for safer rides.',
    body: 'ID verified drivers, share trip tools, and SOS support when you need them.',
    pill: 'Safety tools',
  },
]

export function renderOnboardingScreen({ container }: ScreenRenderContext): void {
  mountTopBar({ title: 'COMMUTR' })
  const slide = SLIDES[obIndex] ?? SLIDES[0]!

  container.className = 'cm-screen cm-screen--full'
  container.innerHTML = `
    <div class="cm-onboarding">
      <div class="cm-onboarding__hero">
        <div class="cm-card cm-onboarding__route-preview">
          ${renderBadge(slide.pill, 'brand')}
          <h1 class="cm-display-lg cm-mt-4">${slide.title}</h1>
          <p class="cm-body cm-muted cm-mt-4">${slide.body}</p>
          ${renderRouteTimeline({
            origin: 'London, ON',
            destination: 'Toronto, ON',
            originDetail: 'Masonville Mall',
            destinationDetail: 'Union Station',
            departureAt: new Date().toISOString(),
          })}
          <p class="cm-caption cm-mt-4" style="color:var(--cm-brand-strong);font-weight:700">Seat held · No booking fees</p>
        </div>
        <div class="cm-ob-dots" aria-hidden="true">
          ${SLIDES.map((_, i) => `<span class="cm-ob-dot${i === obIndex ? ' cm-ob-dot--active' : ''}"></span>`).join('')}
        </div>
      </div>
      <div class="cm-stack">
        ${renderButton(obIndex < SLIDES.length - 1 ? 'Continue' : 'Create free account', { variant: 'primary', block: true, action: 'ob-next', go: 'signup' })}
        ${renderButton('Sign in', { variant: 'secondary', block: true, go: 'signup' })}
        ${renderButton('Continue as guest', { variant: 'secondary', block: true, action: 'guest-browse' })}
        ${renderButton('Skip', { variant: 'tertiary', block: true, action: 'ob-finish' })}
      </div>
    </div>`
}

export function obNextStep(): void {
  if (obIndex < SLIDES.length - 1) {
    obIndex++
    const container = document.getElementById('appScreen')
    if (container) renderOnboardingScreen({ container })
  }
}

export function finishOnboardingFlow(): void {
  markOnboardingComplete()
  go('home')
}

export function resetOnboardingIndex(): void {
  obIndex = 0
}

export function initOnboarding(): void {
  resetOnboardingIndex()
}
