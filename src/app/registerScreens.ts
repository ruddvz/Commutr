import { registerScreen } from './screenRegistry'
import { renderOnboardingScreen } from '@/screens/onboardingScreen'
import { renderAuthScreen } from '@/screens/authScreen'
import { renderHomeScreen } from '@/screens/homeScreen'
import { renderSearchScreen } from '@/screens/searchScreen'
import { renderPostRideScreen } from '@/screens/postRideScreen'
import { renderRideDetailScreen } from '@/screens/rideDetailScreen'
import { renderInboxScreen } from '@/screens/inboxScreen'
import { renderChatScreen } from '@/screens/chatScreen'
import { renderProfileScreen } from '@/screens/profileScreen'
import { renderDriverDashboardScreen } from '@/screens/driverDashboardScreen'
import { renderNotificationsScreen } from '@/screens/notificationsScreen'
import { renderTripHistoryScreen } from '@/screens/tripHistoryScreen'
import { renderSettingsScreen } from '@/screens/settingsScreen'
import { renderSafetyScreen } from '@/screens/safetyScreen'
import { renderProScreen } from '@/screens/proScreen'

export function registerAllScreens(): void {
  registerScreen({ id: 'ob', render: renderOnboardingScreen })
  registerScreen({ id: 'signup', render: renderAuthScreen })
  registerScreen({ id: 'home', render: renderHomeScreen, authRequired: false })
  registerScreen({ id: 'search', render: renderSearchScreen })
  registerScreen({ id: 'post', render: renderPostRideScreen, authRequired: true })
  registerScreen({ id: 'detail', render: renderRideDetailScreen })
  registerScreen({ id: 'chat', render: renderChatScreen, authRequired: true })
  registerScreen({ id: 'inbox', render: renderInboxScreen, authRequired: true })
  registerScreen({ id: 'profile', render: renderProfileScreen, authRequired: true })
  registerScreen({ id: 'dashboard', render: renderDriverDashboardScreen, authRequired: true })
  registerScreen({ id: 'notifs', render: renderNotificationsScreen, authRequired: true })
  registerScreen({ id: 'history', render: renderTripHistoryScreen, authRequired: true })
  registerScreen({ id: 'settings', render: renderSettingsScreen, authRequired: true })
  registerScreen({ id: 'sos', render: renderSafetyScreen })
  registerScreen({ id: 'sub', render: renderProScreen, authRequired: true })
}
