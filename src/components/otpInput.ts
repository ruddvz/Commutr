/**
 * Show the OTP (one-time password) input panel.
 */
export function showOTP(): void {
  const panel = document.getElementById('otp-panel')
  if (panel) panel.style.display = ''
  // Focus first OTP box
  const first = document.querySelector<HTMLInputElement>('.otpbox')
  first?.focus()
}

/**
 * Auto-advance focus between OTP digit inputs.
 * @param input - The current input element
 * @param index - 0-based index of this input among .otpbox elements
 */
export function otpMove(input: HTMLInputElement, index: number): void {
  const boxes = Array.from(document.querySelectorAll<HTMLInputElement>('.otpbox'))

  // Only allow digits
  input.value = input.value.replace(/\D/g, '').slice(-1)

  if (input.value && index < boxes.length - 1) {
    boxes[index + 1]?.focus()
  }

  // Auto-submit when all boxes are filled
  const code = boxes.map((b) => b.value).join('')
  if (code.length === boxes.length) {
    verifyOtp(code)
  }
}

function verifyOtp(code: string): void {
  // Placeholder — real verification goes through authService
  console.warn('OTP submitted:', code)
}
