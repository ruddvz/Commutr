# COMMUTR UI Baseline Audit

**Date:** 2026-06-05  
**Branch:** `cursor/ui-ios-pwa-redesign-ec11`  
**Design system:** Calm Mobility System (light-first)

## Pre-redesign issues (resolved)

| Issue            | Before                                  | After                                   |
| ---------------- | --------------------------------------- | --------------------------------------- |
| Monolithic HTML  | ~6200-line `index.html` with 14 screens | Minimal shell + TS screen modules       |
| Monolithic CSS   | Root `style.css` imported everywhere    | Modular CSS under `src/styles/`         |
| Visual direction | Dark/neon prototype                     | Light-first green trust brand           |
| Navigation       | Duplicated tab bars per screen          | Single `BottomNav` + `TopBar`           |
| Ride cards       | Flat prototype cards                    | Reusable `RideCard` with route timeline |
| iOS safe areas   | Partial token support                   | Shell, nav, sticky CTAs, sheets         |
| PWA theme        | `#050607` dark                          | `#1f7a4d` brand green                   |

## Screens migrated to TypeScript

- [x] Onboarding
- [x] Auth (sign in / create account)
- [x] Home
- [x] Search (+ filter/sort sheets)
- [x] Ride detail (+ seat request sheet)
- [x] Post ride (5-step guided flow)
- [x] Inbox
- [x] Chat
- [x] Profile
- [x] Driver dashboard
- [x] Notifications
- [x] Trip history
- [x] Settings
- [x] Safety / SOS
- [x] Pro subscription

## Quality gate

Run before merge:

```bash
pnpm format
pnpm lint:check
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

## iOS PWA checklist

- [x] `viewport-fit=cover`
- [x] `100svh` shell height
- [x] Safe-area padding on shell and bottom nav
- [x] 16px minimum input font size
- [x] Light theme-color for status bar
- [x] System font stack (SF Pro / -apple-system)

## Notes

- Apple/Google social auth buttons remain prototype-only (toast on tap).
- Legacy root `style.css` is no longer imported; file retained for reference until deleted in a follow-up.
