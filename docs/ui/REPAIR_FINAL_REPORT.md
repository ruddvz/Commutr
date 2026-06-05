# Commutr iOS 26 PWA Repair — Final Report

## Summary

- **What changed:** Full P0 stabilization and iOS 26 dark-theme PWA repair — runtime modes (`local-api` / `production-api` / `static-demo`), seeded Canadian demo rides with graceful API fallback, redesigned Home hero/search/dock, SVG navigation icons, compact ride cards, reconnect notices (no fatal red errors), error boundary, PWA manifest/SW updates, demo seat-request persistence, E2E + screenshot QA.
- **Deployment URL:** https://<owner>.github.io/Commutr/ (GitHub Pages)
- **Runtime mode on GitHub Pages:** `static-demo` (auto-detected via `github.io` hostname)

## Commands run

- pnpm install: pass
- pnpm run format:check: pass
- pnpm run lint:check: pass
- pnpm run typecheck: pass
- pnpm run test: pass (34 tests)
- pnpm run build: pass
- pnpm run test:e2e: pass (22 tests)

## Screenshots attached

- iPhone SE: `docs/ui/screenshots/iphone-se-*.png`
- iPhone 390/430: `docs/ui/screenshots/iphone-14-*.png`, `iphone-pro-max-*.png`
- iPad: `docs/ui/screenshots/ipad-portrait-*.png`, `ipad-landscape-*.png`
- Desktop: `docs/ui/screenshots/desktop-wide-*.png`

## Completed checklist

- **P0 technical stabilization:** runtime mode, demo data, ride service fallback, no fatal Home error, error boundary
- **App shell:** dark tokens, safe-area padding, SVG bottom nav, scrolled header
- **Home:** hero card, stacked fields, route chips, today's rides, reconnect notice, compact cards
- **Search:** fallback results, filter sheet, reconnect notice
- **Ride Detail:** demo fallback, sticky CTA, not-found card
- **Post Ride:** demo local persistence via `rideService.create`
- **Messages:** inbox renders with seeded conversations
- **Profile / Notifications / Settings:** existing screen modules + dark theme tokens
- **Secondary screens:** onboarding guest browse, safety, history, dashboard retained
- **PWA:** manifest colors, SW versioning, update toast

## Remaining issues

| Issue                        | Severity | Why not fixed                         | Next step                                      |
| ---------------------------- | -------- | ------------------------------------- | ---------------------------------------------- |
| Live backend on GitHub Pages | P2       | Static host cannot run Express/Prisma | Deploy API separately; set `VITE_API_BASE_URL` |
| PNG maskable icons           | P3       | SVG icons work; PNG optional          | Generate PNG assets from brand kit             |
| Light mode                   | P3       | Plan specifies single dark theme      | Design full light token override later         |

## Notes for owner

- GitHub Pages builds with `GITHUB_PAGES=true` (set in deploy workflow).
- To connect a live API: set `VITE_API_BASE_URL=https://your-api.example.com` in the build environment.
- Demo mode stores posted rides and seat requests in `localStorage` for portfolio/demo use.
