import { rideService } from '@/services/rideService'
import { appStore } from '@/app/store'
import { go } from '@/utils/router'
import { renderButton } from '@/components/Button'
import { renderInputField } from '@/components/InputField'
import { renderChip, renderChipRow } from '@/components/Chip'
import { openBottomSheet, closeBottomSheet } from '@/components/BottomSheet'
import { mountTopBar } from '@/components/TopBar'
import { bindRideCardClicks, mountRideCards } from '@/components/RideCard'
import { showEmpty, showError, showLoading } from '@/components/uiStates'
import type { ScreenRenderContext } from '@/app/screenRegistry'
import type { Ride } from '@/contracts/types/Ride'
import { escapeHtml } from '@/utils/dom'

let lastSearch: { origin?: string; destination?: string; date?: string; seats?: number } = {}
let sortOrder: 'earliest' | 'cheapest' = 'earliest'
let filterVerified = false

function readSearchForm(container: HTMLElement): typeof lastSearch {
  const origin = container.querySelector<HTMLInputElement>('#search-origin')?.value.trim()
  const destination = container.querySelector<HTMLInputElement>('#search-destination')?.value.trim()
  const date = container.querySelector<HTMLInputElement>('#search-date')?.value
  const seatsRaw = container.querySelector<HTMLInputElement>('#search-seats')?.value
  const seats = seatsRaw ? parseInt(seatsRaw, 10) : undefined
  return { origin, destination, date: date || undefined, seats }
}

export function renderSearchScreen({ container }: ScreenRenderContext): void {
  mountTopBar({
    title: 'Search rides',
    showBack: true,
    backGo: 'home',
    actions: `<button type="button" class="cm-icon-button" data-action="open-filters" aria-label="Filters">☰</button>`,
  })

  const today = new Date().toISOString().slice(0, 10)
  container.className = 'cm-screen'
  container.innerHTML = `
    <div class="cm-search-summary">
      <div class="cm-row cm-row--between">
        <div>
          <div class="cm-body" style="font-weight:750" id="search-route-label">${escapeHtml(lastSearch.origin ?? 'London, ON')} → ${escapeHtml(lastSearch.destination ?? 'Toronto, ON')}</div>
          <div class="cm-caption cm-muted" id="search-meta-label">Today · 1 seat</div>
        </div>
        <button type="button" class="cm-chip" data-action="edit-search">Edit</button>
      </div>
    </div>

    <div class="cm-stack">
      ${renderChipRow(
        [
          renderChip('Today', { active: true }),
          renderChip('Cheapest', { action: 'sort-cheapest', pressed: sortOrder === 'cheapest' }),
          renderChip('Earliest', { action: 'sort-earliest', pressed: sortOrder === 'earliest' }),
          renderChip('Verified', { action: 'filter-verified', pressed: filterVerified }),
          renderChip('Women-preferred', {}),
        ].join(''),
      )}

      <div class="cm-row cm-row--between">
        <p class="cm-caption cm-muted" id="search-count">Searching…</p>
        <button type="button" class="cm-chip" data-action="open-sort">Sort</button>
      </div>

      <div id="search-results" class="cm-card-list"></div>
    </div>

    <div id="search-form-panel" class="cm-hidden">
      <div class="cm-card cm-form-card cm-stack">
        ${renderInputField({ id: 'search-origin', label: 'From', value: lastSearch.origin ?? 'London, ON' })}
        ${renderInputField({ id: 'search-destination', label: 'To', value: lastSearch.destination ?? 'Toronto, ON' })}
        ${renderInputField({ id: 'search-date', label: 'Date', type: 'date', value: lastSearch.date ?? today })}
        ${renderInputField({ id: 'search-seats', label: 'Seats', type: 'number', value: String(lastSearch.seats ?? 1), min: '1', max: '4' })}
        ${renderButton('Search rides', { variant: 'primary', block: true, action: 'search-run', id: 'search-submit' })}
      </div>
    </div>`

  bindSearchEvents(container)
  void runSearch(container)
}

function bindSearchEvents(container: HTMLElement): void {
  container.querySelector('[data-action="edit-search"]')?.addEventListener('click', () => {
    const panel = container.querySelector('#search-form-panel')
    panel?.classList.toggle('cm-hidden')
  })

  container.querySelector('[data-action="open-filters"]')?.addEventListener('click', () => {
    openFilterSheet(container)
  })

  container.querySelector('[data-action="open-sort"]')?.addEventListener('click', () => {
    openSortSheet(container)
  })

  container.querySelector('[data-action="sort-cheapest"]')?.addEventListener('click', () => {
    sortOrder = 'cheapest'
    void runSearch(container)
  })

  container.querySelector('[data-action="sort-earliest"]')?.addEventListener('click', () => {
    sortOrder = 'earliest'
    void runSearch(container)
  })

  container.querySelector('[data-action="filter-verified"]')?.addEventListener('click', () => {
    filterVerified = !filterVerified
    void runSearch(container)
  })
}

function openFilterSheet(container: HTMLElement): void {
  openBottomSheet(
    'Filters',
    `
      ${renderInputField({ id: 'filter-max-price', label: 'Max price per seat', type: 'number', placeholder: '50' })}
      ${renderChipRow(renderChip('Verified only', { pressed: filterVerified, action: 'sheet-verified' }))}
    `,
    renderButton('Apply filters', { variant: 'primary', block: true, action: 'apply-filters' }),
  )

  document.querySelector('[data-action="apply-filters"]')?.addEventListener('click', () => {
    closeBottomSheet()
    void runSearch(container)
  })
}

function openSortSheet(container: HTMLElement): void {
  openBottomSheet(
    'Sort by',
    renderChipRow(
      [
        renderChip('Earliest departure', {
          pressed: sortOrder === 'earliest',
          action: 'pick-earliest',
        }),
        renderChip('Lowest price', { pressed: sortOrder === 'cheapest', action: 'pick-cheapest' }),
      ].join(''),
    ),
  )

  document.querySelector('[data-action="pick-earliest"]')?.addEventListener('click', () => {
    sortOrder = 'earliest'
    closeBottomSheet()
    void runSearch(container)
  })
  document.querySelector('[data-action="pick-cheapest"]')?.addEventListener('click', () => {
    sortOrder = 'cheapest'
    closeBottomSheet()
    void runSearch(container)
  })
}

function sortRides(rides: Ride[]): Ride[] {
  const copy = [...rides]
  if (sortOrder === 'cheapest') {
    copy.sort((a, b) => a.pricePerSeat - b.pricePerSeat)
  } else {
    copy.sort((a, b) => new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime())
  }
  return filterVerified ? copy.filter((r) => r.driverVerified) : copy
}

export async function runSearch(container?: HTMLElement): Promise<void> {
  const root = container ?? document.getElementById('appScreen')
  if (!root) return

  const results = root.querySelector('#search-results') as HTMLElement | null
  const count = root.querySelector('#search-count')
  if (!results) return

  lastSearch = readSearchForm(root)
  if (lastSearch.origin && lastSearch.destination) {
    appStore.addRecentSearch({
      origin: lastSearch.origin,
      destination: lastSearch.destination,
      date: lastSearch.date,
    })
  }

  const routeLabel = root.querySelector('#search-route-label')
  const metaLabel = root.querySelector('#search-meta-label')
  if (routeLabel) {
    routeLabel.textContent = `${lastSearch.origin ?? 'London, ON'} → ${lastSearch.destination ?? 'Toronto, ON'}`
  }
  if (metaLabel) {
    metaLabel.textContent = `${lastSearch.date ?? 'Today'} · ${lastSearch.seats ?? 1} seat`
  }

  showLoading(results, 'Searching rides…')

  try {
    const rides = await rideService.search({
      origin: lastSearch.origin,
      destination: lastSearch.destination,
      date: lastSearch.date,
      seats: lastSearch.seats,
    })
    const sorted = sortRides(rides)
    if (count) count.textContent = `${sorted.length} ride${sorted.length === 1 ? '' : 's'} found`
    renderResults(results, sorted)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Search failed'
    if (count) count.textContent = 'Search failed'
    showError(results, message)
  }
}

function renderResults(container: HTMLElement, rides: Ride[]): void {
  if (rides.length === 0) {
    showEmpty(container, {
      title: 'No rides to this route yet',
      body: "Create a route alert and we'll let you know when someone posts this route.",
      actionLabel: 'Post this route',
      actionGo: 'post',
    })
    return
  }

  mountRideCards(container, rides, 'search')
  bindRideCardClicks(container, (id) => {
    appStore.setSelectedRideId(id)
    go('detail')
  })
}

export async function retryLastSearch(): Promise<void> {
  await runSearch()
}

export function initSearchScreen(): void {
  const container = document.getElementById('appScreen')
  if (container) renderSearchScreen({ container })
}
