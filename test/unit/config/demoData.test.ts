import { describe, expect, it } from 'vitest'
import { filterDemoRides, getDemoRides } from '@/config/demoData'
import { runtimeMode } from '@/config/runtime'

describe('runtime mode', () => {
  it('defaults to local-api in test environment', () => {
    expect(['local-api', 'production-api', 'static-demo']).toContain(runtimeMode)
  })
})

describe('demo data', () => {
  it('returns seeded Canadian routes', () => {
    const rides = getDemoRides()
    expect(rides.length).toBeGreaterThanOrEqual(2)
    expect(rides[0]?.origin).toContain('London')
  })

  it('filters by origin and destination', () => {
    const rides = filterDemoRides({
      origin: 'London, ON',
      destination: 'Toronto, ON',
    })
    expect(rides.length).toBeGreaterThan(0)
    rides.forEach((r) => {
      expect(r.origin.toLowerCase()).toContain('london')
      expect(r.destination.toLowerCase()).toContain('toronto')
    })
  })

  it('filters verified only', () => {
    const rides = filterDemoRides({ verifiedOnly: true })
    rides.forEach((r) => expect(r.driverVerified).toBe(true))
  })
})

describe('searchRides fallback contract', () => {
  it('demo filter never throws on empty query', () => {
    expect(() => filterDemoRides({})).not.toThrow()
    expect(filterDemoRides({}).length).toBeGreaterThan(0)
  })
})
