import { rideService } from '@/services/rideService'
import { appStore } from '@/app/store'
import { go } from '@/utils/router'
import { renderRideCard } from '@/components/rideCard'
import { showLoading, showEmpty, showError } from '@/components/uiStates'
import type { Ride } from '@/contracts/types/Ride'
import { escapeHtml } from '@/utils/dom'

let lastSearch: { origin?: string; destination?: string; date?: string; seats?: number } = {}

function resultsContainer(): HTMLElement | null {
  return document.getElementById('search-results')
}

function readSearchForm(): typeof lastSearch {
  const origin = (document.getElementById('search-origin') as HTMLInputElement | null)?.value.trim()
  const destination = (
    document.getElementById('search-destination') as HTMLInputElement | null
  )?.value.trim()
  const date = (document.getElementById('search-date') as HTMLInputElement | null)?.value
  const seatsRaw = (document.getElementById('search-seats') as HTMLInputElement | null)?.value
  const seats = seatsRaw ? parseInt(seatsRaw, 10) : undefined
  return { origin, destination, date: date || undefined, seats }
}

export async function runSearch(): Promise<void> {
  const container = resultsContainer()
  if (!container) return

  lastSearch = readSearchForm()
  if (lastSearch.origin && lastSearch.destination) {
    appStore.addRecentSearch({
      origin: lastSearch.origin,
      destination: lastSearch.destination,
      date: lastSearch.date,
    })
  }

  showLoading(container, 'Searching rides…')

  try {
    const rides = await rideService.search({
      origin: lastSearch.origin,
      destination: lastSearch.destination,
      date: lastSearch.date,
      seats: lastSearch.seats,
    })
    renderResults(container, rides)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Search failed'
    showError(container, message)
  }
}

export async function retryLastSearch(): Promise<void> {
  await runSearch()
}

function renderResults(container: HTMLElement, rides: Ride[]): void {
  if (rides.length === 0) {
    showEmpty(container, {
      title: 'No rides found',
      body: 'Try different dates or create a route alert.',
      actionLabel: 'Post this route',
      actionGo: 'post',
    })
    return
  }

  container.innerHTML = rides
    .map((ride) => {
      const card = renderRideCard(ride)
      return `<div class="search-result-item" data-ride-id="${escapeHtml(ride.id)}">${card}</div>`
    })
    .join('')

  container.querySelectorAll<HTMLElement>('[data-ride-id]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset['rideId']
      if (!id) return
      appStore.setSelectedRideId(id)
      go('detail')
    })
  })
}

export function initSearchScreen(): void {
  const btn = document.getElementById('search-submit')
  if (btn && !btn.dataset['bound']) {
    btn.dataset['bound'] = '1'
    btn.setAttribute('data-action', 'search-run')
  }
}
