# COMMUTR v5 — Claude Instructions

## Project Description

COMMUTR is Canada's fee-free intercity carpooling PWA. It connects drivers and passengers for long-distance trips (100–1 500 km) at zero platform fees. Mobile-first, dark themed, glassmorphism UI.

## Architecture Overview

```
commutr-v5/
├── src/                   # Vite + TypeScript frontend
│   ├── components/        # UI components (toast, navigation, chat, rating…)
│   ├── config/            # App constants and env loader
│   ├── contracts/         # Shared types and Zod schemas (frontend + backend)
│   │   ├── types/         # TypeScript interfaces (User, Ride, Message, Booking)
│   │   └── schemas/       # Zod schemas for validation
│   ├── services/          # API client wrappers (authService, rideService, chatService)
│   ├── styles/            # CSS modules (main.css → progressively extracted)
│   ├── utils/             # DOM helpers, router, storage, format, validation
│   └── index.ts           # Entry point — imports styles, wires globals, inits app
├── server/                # Node.js + Express API
│   ├── middleware/        # auth (JWT), validate (Zod), errorHandler
│   ├── routes/            # auth.ts, rides.ts, chat.ts
│   └── index.ts           # Express app factory
├── test/                  # Vitest tests
│   ├── unit/              # Pure function and schema tests
│   ├── integration/       # API endpoint tests via supertest
│   └── setup.ts           # Global test setup
├── public/                # Static assets served by Vite / Express
│   ├── icons/             # SVG app icons
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
└── index.html             # Single-page entry (Vite processes this)
```

## Development Commands

```bash
npm run dev          # Vite dev server on :3000
npm run dev:server   # Express API on :3001 (tsx watch)
npm run dev:all      # Both servers concurrently
npm run typecheck    # TypeScript check (no emit)
npm run lint         # ESLint + fix
npm run format       # Prettier write
npm run test         # Vitest run (single pass)
npm run test:watch   # Vitest watch
npm run test:coverage # Vitest + coverage report
npm run build        # Vite build → dist/client/
```

## Key Conventions

### TypeScript
- Strict mode enabled, `noUncheckedIndexedAccess: true`
- Path alias: `@/*` → `src/*`
- No `any` types — use `unknown` and type-guard
- Explicit return types on exported functions

### CSS
- `src/styles/main.css` re-exports the monolithic `style.css` via `@import`
- New components should add their styles as separate files and import them in main.css
- CSS variables are defined in `:root` — never use raw hex values inside components

### Security
- JWT secret must be in `JWT_SECRET` env var — server exits if not set
- All user input validated with Zod schemas via `validate()` middleware
- `helmet()` and `cors()` applied to every request
- Rate limiting: 200 req / 15 min per IP
- `escapeHtml()` must be used before inserting user content into DOM

### Navigation (during migration)
- Router lives in `src/utils/router.ts` — use `go(screenId)` to navigate
- Window-level exports in `src/index.ts` bridge the `onclick=` attributes in index.html
- As screens are converted to component modules, remove the window exports

## Environment Variables

Copy `.env.example` → `.env` and fill in:

| Variable | Description |
|---|---|
| `PORT` | API server port (default `3001`) |
| `CLIENT_ORIGIN` | Allowed CORS origin (default `http://localhost:3000`) |
| `JWT_SECRET` | Long random string (≥ 32 chars) — **required** |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `BCRYPT_ROUNDS` | bcrypt cost factor (default `12`) |
| `VITE_API_URL` | Frontend API base URL (default `/api`) |

## Screens

| ID | Screen | Auth required |
|---|---|---|
| `ob` | Onboarding | No |
| `signup` | Sign up / Log in | No |
| `home` | Home dashboard | Yes |
| `search` | Search rides | Yes |
| `post` | Post a ride | Yes |
| `detail` | Ride detail | Yes |
| `chat` | Chat thread | Yes |
| `inbox` | Inbox | Yes |
| `profile` | Driver profile | Yes |
| `dashboard` | Driver dashboard | Yes |
| `notifs` | Notifications | Yes |
| `history` | Trip history | Yes |
| `settings` | Settings | Yes |
| `sos` | SOS / Emergency | No |
| `sub` | Subscription | Yes |
