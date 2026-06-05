import { renderButton } from '@/components/Button'
import { renderInputField } from '@/components/InputField'
import { mountTopBar } from '@/components/TopBar'
import { authService } from '@/services/authService'
import { appStore } from '@/app/store'
import { go, markOnboardingComplete } from '@/utils/router'
import { showToast } from '@/components/toast'
import type { ScreenRenderContext } from '@/app/screenRegistry'

let authMode: 'signup' | 'login' = 'signup'

export function renderAuthScreen({ container }: ScreenRenderContext): void {
  mountTopBar({ title: 'COMMUTR', showBack: true, backGo: 'ob' })
  container.className = 'cm-screen cm-screen--full'
  container.innerHTML = `
    <div class="cm-auth-screen cm-stack cm-stack--lg">
      <div>
        <h1 class="cm-title-lg">${authMode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
        <p class="cm-body cm-muted cm-mt-2">Fee-free intercity carpooling across Canada.</p>
      </div>
      <div class="cm-segmented" role="tablist">
        <button type="button" class="cm-segmented__btn" data-action="auth-mode" data-mode="signup" aria-selected="${authMode === 'signup'}">Create account</button>
        <button type="button" class="cm-segmented__btn" data-action="auth-mode" data-mode="login" aria-selected="${authMode === 'login'}">Sign in</button>
      </div>
      <div class="cm-card cm-form-card cm-stack">
        ${authMode === 'signup' ? renderInputField({ id: 'signup-name', label: 'Full name', placeholder: 'Your name', autocomplete: 'name' }) : ''}
        ${renderInputField({ id: authMode === 'signup' ? 'signup-email' : 'login-email', label: 'Email', type: 'email', inputMode: 'email', autocomplete: 'email', placeholder: 'you@example.com' })}
        ${renderInputField({ id: authMode === 'signup' ? 'signup-password' : 'login-password', label: 'Password', type: 'password', autocomplete: authMode === 'signup' ? 'new-password' : 'current-password', placeholder: 'At least 8 characters' })}
        ${authMode === 'signup' ? renderInputField({ id: 'signup-phone', label: 'Phone', type: 'tel', inputMode: 'tel', autocomplete: 'tel', placeholder: '+1 (555) 000-0000', helper: 'Used for ride coordination and safety.' }) : ''}
        ${renderButton(authMode === 'signup' ? 'Create account' : 'Sign in', { variant: 'primary', block: true, action: authMode === 'signup' ? 'signup-submit' : 'login-submit' })}
      </div>
      <p class="cm-caption cm-muted cm-text-center">By continuing you agree to COMMUTR Terms and Privacy Policy.</p>
      <div class="cm-stack">
        ${renderButton('Continue with Apple', { variant: 'outline', block: true, action: 'auth-prototype', disabled: false })}
        ${renderButton('Continue with Google', { variant: 'outline', block: true, action: 'auth-prototype' })}
      </div>
    </div>`

  container.querySelectorAll<HTMLElement>('[data-action="auth-mode"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset['mode'] as 'signup' | 'login'
      authMode = mode
      renderAuthScreen({ container })
    })
  })
}

export function setAuthMode(mode: 'signup' | 'login'): void {
  authMode = mode
}

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
