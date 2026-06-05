import { searchRides } from '@/services/rideService'
import { appStore } from '@/app/store'
import { go } from '@/utils/router'
import { renderButton } from '@/components/Button'
import { renderInputField } from '@/components/InputField'
import { renderChip, renderChipRow } from '@/components/Chip'
import { mountTopBar } from '@/components/TopBar'
import { iconBell } from '@/components/icons'
import { bindRideCardClicks, mountRideCards, renderRideCardSkeleton } from '@/components/RideCard'
import { showEmpty } from '@/components/uiStates'
import { registerScreenRender } from '@/components/ErrorBoundary'
import type { ScreenRenderContext } from '@/app/screenRegistry'

const POPULAR_ROUTES = [
  { origin: 'London, ON', destination: 'Toronto, ON' },
  { origin: 'Toronto, ON', destination: 'Montréal, QC' },
  { origin: 'Ottawa, ON', destination: 'Montréal, QC' },
]

export function renderHomeScreen({ container }: ScreenRenderContext): void {
  registerScreenRender(() => renderHomeScreen({ container }))

  mountTopBar({
    subtitle: 'London, ON',
    actions: `<button type="button" class="cm-icon-button" data-go="notifs" aria-label="Notifications">${iconBell()}</button>`,
  })

  container.className = 'cm-screen cm-screen--home'
  container.innerHTML = `
    <div class="cm-home-grid">
      <div class="cm-home-grid__left cm-stack cm-stack--lg">
        <section class="cm-card cm-search-hero">
          <h2 class="cm-search-hero__title">Where are you going?</h2>
          <div class="cm-search-hero__fields">
            ${renderInputField({ id: 'home-origin', label: 'From', placeholder: 'London, ON', value: 'London, ON', variant: 'dark' })}
            ${renderInputField({ id: 'home-destination', label: 'To', placeholder: 'Toronto, ON', value: 'Toronto, ON', variant: 'dark' })}
          </div>
          ${renderChipRow(
            [
              renderChip('Today', { active: true }),
              renderChip('1 seat', { active: true }),
              renderChip('Verified', {}),
            ].join(''),
          )}
          ${renderButton('Search rides', { variant: 'primary', block: true, action: 'home-search' })}
        </section>

        <section>
          <h3 class="cm-section-title">Popular routes</h3>
          <div class="cm-route-chip-row">
            ${POPULAR_ROUTES.map((r) =>
              renderChip(`${r.origin.split(',')[0]} → ${r.destination.split(',')[0]}`, {
                action: 'home-route',
                value: `${r.origin}|${r.destination}`,
                className: 'cm-route-chip',
              }),
            ).join('')}
          </div>
        </section>

        <section class="cm-trust-panel">
          <p class="cm-trust-panel__title">Find a safe intercity ride</p>
          <p class="cm-caption cm-muted cm-mt-2">Verified drivers · No platform fee · Direct chat</p>
        </section>
      </div>

      <section class="cm-home-grid__right">
        <div class="cm-row cm-row--between cm-mb-4">
          <h3 class="cm-section-title" style="margin:0">Today's rides</h3>
          <button type="button" class="cm-filter-pill" data-action="home-filter-verified">Verified</button>
        </div>
        <div id="home-reconnect"></div>
        <div id="home-rides" class="cm-card-list">${renderRideCardSkeleton()}${renderRideCardSkeleton()}</div>
      </section>
    </div>`

  bindHomeEvents(container)
  void loadHomeRides()
}

function bindHomeEvents(container: HTMLElement): void {
  container.querySelectorAll<HTMLElement>('[data-action="home-route"]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const [origin, destination] = (chip.dataset['chipValue'] ?? '').split('|')
      const o = container.querySelector<HTMLInputElement>('#home-origin')
      const d = container.querySelector<HTMLInputElement>('#home-destination')
      if (o && origin) o.value = origin
      if (d && destination) d.value = destination
      go('search')
    })
  })

  container.querySelector('[data-action="home-search"]')?.addEventListener('click', () => {
    go('search')
  })
}

async function loadHomeRides(): Promise<void> {
  const list = document.getElementById('home-rides')
  const reconnect = document.getElementById('home-reconnect')
  if (!list) return

  const result = await searchRides({})

  if (reconnect) reconnect.innerHTML = ''

  if (result.status === 'cached' || result.status === 'demo') {
    reconnect?.insertAdjacentHTML(
      'beforeend',
      `<div class="cm-reconnect-notice" role="status">
        <p class="cm-reconnect-notice__title">Couldn't reach live rides</p>
        <p class="cm-caption cm-muted">Showing sample routes while we reconnect. Your search still works.</p>
        <button type="button" class="cm-button cm-button--secondary cm-button--sm" data-action="retry-last">Try again</button>
      </div>`,
    )
  }

  if (result.rides.length === 0) {
    showEmpty(list, {
      title: 'No rides yet for this route',
      body: 'Try another date, remove Verified only, or post the first ride.',
      actionLabel: 'Post a ride',
      actionGo: 'post',
    })
    return
  }

  mountRideCards(list, result.rides.slice(0, 5), 'home')
  bindRideCardClicks(list, (id) => {
    appStore.setSelectedRideId(id)
    go('detail')
  })
}

export function initHomeScreen(): void {
  const container = document.getElementById('appScreen')
  if (container) renderHomeScreen({ container })
}
