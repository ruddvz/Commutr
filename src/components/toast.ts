/**
 * Toast notification component.
 */

let toastTimer: ReturnType<typeof setTimeout> | null = null

export function showToast(message: string, durationMs = 3000): void {
  const toast = document.getElementById('toast')
  if (!toast) return

  if (toastTimer !== null) {
    clearTimeout(toastTimer)
    toastTimer = null
  }

  toast.textContent = message
  toast.classList.add('show')

  toastTimer = setTimeout(() => {
    toast.classList.remove('show')
    toastTimer = null
  }, durationMs)
}
