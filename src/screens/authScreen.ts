import { authService } from '@/services/authService'
import { appStore } from '@/app/store'
import { go, markOnboardingComplete } from '@/utils/router'
import { showToast } from '@/components/toast'

function field(id: string): HTMLInputElement | null {
  return document.getElementById(id) as HTMLInputElement | null
}

export async function handleSignupSubmit(): Promise<void> {
  const name = field('signup-name')?.value.trim()
  const email = field('signup-email')?.value.trim()
  const password = field('signup-password')?.value ?? ''
  const phone = field('signup-phone')?.value.trim()

  if (!name || name.length < 2) {
    showToast('Enter your full name')
    return
  }
  if (!email?.includes('@')) {
    showToast('Enter a valid email')
    return
  }
  if (password.length < 8) {
    showToast('Password must be at least 8 characters')
    return
  }

  try {
    const user = await authService.register({ name, email, password, phone: phone || undefined })
    appStore.setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      ratingAvg: (user as { ratingAvg?: number }).ratingAvg,
      ratingCount: (user as { ratingCount?: number }).ratingCount,
      role: (user as { role?: string }).role,
    })
    markOnboardingComplete()
    showToast('Welcome to COMMUTR')
    go('home')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sign up failed'
    showToast(message)
  }
}

export async function handleLoginSubmit(): Promise<void> {
  const email = (field('login-email') ?? field('signup-email'))?.value.trim()
  const password = field('login-password')?.value ?? field('signup-password')?.value ?? ''

  if (!email || !password) {
    showToast('Enter email and password')
    return
  }

  try {
    const user = await authService.login({ email, password })
    appStore.setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      verified: user.verified,
    })
    markOnboardingComplete()
    showToast('Signed in')
    go('home')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sign in failed'
    showToast(message)
  }
}
