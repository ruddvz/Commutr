import type { ScreenId } from '@/utils/router'
import { go, SCREEN_IDS } from '@/utils/router'
import { showOTP } from '@/components/otpInput'
import { chipSel, segSel, stepChg } from '@/components/chipSelector'
import { showToast } from '@/components/toast'
import { submitRating } from '@/components/starRating'
import { addEmoji, sendMsg } from '@/components/chat'
import { finishOnboardingFlow, obNextStep } from '@/screens/onboardingScreen'
import { handleSignupSubmit, handleLoginSubmit } from '@/screens/authScreen'
import { runSearch, retryLastSearch } from '@/screens/searchScreen'
import { submitPostRide } from '@/screens/postRideScreen'
import { requestSeatOnDetail } from '@/screens/rideDetailScreen'
import { appStore } from '@/app/store'

function closestAction(el: EventTarget | null): HTMLElement | null {
  if (!(el instanceof Element)) return null
  const hit = el.closest<HTMLElement>('[data-go],[data-action]')
  return hit
}

function parseScreenId(value: string | undefined): ScreenId | null {
  if (!value) return null
  return (SCREEN_IDS as readonly string[]).includes(value) ? (value as ScreenId) : null
}

export function bindGlobalDelegation(): void {
  document.addEventListener('click', (event) => {
    const target = closestAction(event.target)
    if (!target) return

    const screen = parseScreenId(target.dataset['go'])
    if (screen) {
      event.preventDefault()
      go(screen)
      return
    }

    const action = target.dataset['action']
    if (!action) return

    event.preventDefault()
    switch (action) {
      case 'ob-next':
        obNextStep()
        break
      case 'ob-finish':
        finishOnboardingFlow()
        break
      case 'show-otp':
        showOTP()
        break
      case 'signup-submit':
        void handleSignupSubmit()
        break
      case 'login-submit':
        void handleLoginSubmit()
        break
      case 'auth-prototype':
        showToast('Social sign-in is not available in this build. Use email and password.')
        break
      case 'search-run':
        void runSearch()
        break
      case 'retry-last':
        void retryLastSearch()
        break
      case 'post-submit':
        void submitPostRide()
        break
      case 'post-next':
      case 'post-back':
        break
      case 'request-seat':
        void requestSeatOnDetail()
        break
      case 'open-ride':
        {
          const card = target.closest<HTMLElement>('[data-ride-id]')
          const id = card?.dataset['rideId']
          if (id) {
            appStore.setSelectedRideId(id)
            go('detail')
          }
        }
        break
      case 'send-msg':
        sendMsg()
        break
      case 'add-emoji':
        addEmoji(target.dataset['emoji'] ?? '👋')
        break
      case 'submit-rating':
        submitRating()
        break
      case 'chip-select': {
        const group = target.dataset['chipGroup']
        if (group) chipSel(target, group)
        break
      }
      case 'seg-select':
        segSel(target)
        break
      case 'step-change':
        stepChg(target, parseInt(target.dataset['step'] ?? '0', 10))
        break
      default:
        break
    }
  })
}
