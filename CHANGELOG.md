# Changelog

All notable changes to COMMUTR will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- TypeScript migration: `src/` directory with strict `tsconfig.json`
- Vite build toolchain with dev proxy to Express API
- Express API backend (`server/`) with JWT auth, Zod validation, rate limiting, Helmet security
- Shared contracts layer: `src/contracts/types/` and `src/contracts/schemas/`
- Utility modules: `dom.ts`, `router.ts`, `storage.ts`, `format.ts`, `validation.ts`
- Component modules: `toast.ts`, `navigation.ts`, `starRating.ts`, `otpInput.ts`, `chipSelector.ts`, `chat.ts`, `rideCard.ts`
- Service layer: `api.ts`, `authService.ts`, `rideService.ts`, `chatService.ts`
- Vitest test suite with unit and integration tests
- ESLint v9 flat config + Prettier + Husky pre-commit hooks
- GitHub Actions CI pipeline (typecheck → lint → test → build)
- PWA assets moved to `public/` with updated paths
- `.claude/settings.json` with PostToolUse file-organizer hooks
- `CLAUDE.md` project instructions for Claude Code sessions
- `.env.example` with all required environment variable documentation

## [5.0.0] — 2025-01-01

### Added
- Complete mobile-first PWA prototype with 15 screens
- Glassmorphism dark UI design system with CSS custom properties
- Onboarding flow (3 slides) with dot indicators
- OTP authentication screen with auto-advance inputs
- Home screen with ride search bar and category chips
- Search results screen with ride cards (origin, destination, price, seats)
- Ride detail screen with driver profile, route, amenities, reviews
- Chat screen with emoji picker and message bubbles
- Inbox screen with conversation list
- Driver profile screen with stats, ratings, and reviews
- Driver dashboard screen with posted rides and booking requests
- Notifications screen
- Trip history screen
- Settings screen with toggles
- SOS emergency screen with pulsing ring animation
- Subscription plans screen
- Desktop navigation bar (Liquid Glass style)
- Responsive breakpoints: mobile (<768px), tablet (768–1023px), desktop (≥1024px)
- Service worker with cache-first strategy for static assets
- PWA manifest with shortcuts for Search and Post Ride
- Outfit + DM Mono Google Fonts
