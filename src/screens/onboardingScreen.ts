import { go, markOnboardingComplete } from '@/utils/router'

let obIndex = 0
const OB_COUNT = 3

function updateOnboarding(): void {
  const slider = document.getElementById('ob-slider') as HTMLElement | null
  const dots = Array.from(document.querySelectorAll<HTMLElement>('.obdot'))
  if (slider) slider.style.transform = `translateX(-${(obIndex / OB_COUNT) * 100}%)`
  dots.forEach((d, i) => d.classList.toggle('on', i === obIndex))
}

export function initOnboarding(): void {
  updateOnboarding()
}

export function obNextStep(): void {
  if (obIndex < OB_COUNT - 1) {
    obIndex++
    updateOnboarding()
  } else {
    finishOnboardingFlow()
  }
}

export function finishOnboardingFlow(): void {
  markOnboardingComplete()
  go('home')
}
