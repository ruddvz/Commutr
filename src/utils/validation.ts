/**
 * Input validation helpers for user-facing boundaries.
 */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function isValidPhone(phone: string): boolean {
  // Accepts +1XXXXXXXXXX or 10-digit formats
  return /^(\+1)?[2-9]\d{2}[2-9]\d{6}$/.test(phone.replace(/[\s\-().]/g, ''))
}

export function isValidPostalCode(code: string): boolean {
  // Canadian postal code: A1A 1A1
  return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(code.trim())
}

export function sanitizeText(input: string, maxLength = 500): string {
  return input.trim().slice(0, maxLength)
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0
}
