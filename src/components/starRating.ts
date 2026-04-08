import { qsa } from '@/utils/dom'
import { showToast } from './toast'

let selectedRating = 0

/**
 * Highlight stars up to the given rating value.
 */
export function setStar(rating: number): void {
  selectedRating = rating
  const stars = qsa<HTMLElement>('.star-btn')
  stars.forEach((star, i) => {
    star.classList.toggle('active', i < rating)
  })
}

/**
 * Submit the current star rating.
 */
export function submitRating(): void {
  if (selectedRating === 0) {
    showToast('Please select a rating before submitting.')
    return
  }
  showToast(`Thanks! You rated this ride ${selectedRating} star${selectedRating > 1 ? 's' : ''}.`)
  setStar(0)
}
