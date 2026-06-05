/**
 * COMMUTR v5 — Application entry point.
 */

import './styles/main.css'

import { registerServiceWorker } from './utils/pwa'
import { go, getInitialScreen, updateNavState } from './utils/router'
import { bindGlobalDelegation } from './app/delegation'
import { initOnboarding } from './screens/onboardingScreen'
import { authService } from './services/authService'
import { appStore } from './app/store'
import { bindScrollMorph, bindScrollAwareTabbars } from './components/navigation'
import { bindMessageButtons } from './components/chat'
import { mountOfflineBanner } from './components/uiStates'

function init(): void {
  bindGlobalDelegation()
  mountOfflineBanner()
  initOnboarding()

  const initial = getInitialScreen()
  updateNavState(initial)
  go(initial)

  if (authService.isAuthenticated()) {
    void authService
      .fetchMe()
      .then((user) => {
        appStore.setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          verified: user.verified,
          ratingAvg: (user as { ratingAvg?: number }).ratingAvg,
          ratingCount: user.ratingCount,
          role: (user as { role?: string }).role,
        })
      })
      .catch(() => {
        void authService.logout()
      })
  }

  bindScrollMorph()
  bindScrollAwareTabbars()
  bindMessageButtons()
}

document.addEventListener('DOMContentLoaded', init)
registerServiceWorker()
