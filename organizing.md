# COMMUTR v5 — Project Organization Plan

> Incorporating best practices from [claude-organizer](https://github.com/ramakay/claude-organizer) into the COMMUTR carpooling app.

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Target Project Structure](#2-target-project-structure)
3. [Phase 1 — File Organization & Directory Setup](#phase-1--file-organization--directory-setup)
4. [Phase 2 — Frontend Modularization](#phase-2--frontend-modularization)
5. [Phase 3 — Backend Setup (Node.js/Express)](#phase-3--backend-setup-nodejsexpress)
6. [Phase 4 — Build Tooling & TypeScript](#phase-4--build-tooling--typescript)
7. [Phase 5 — Claude Code Hooks Integration](#phase-5--claude-code-hooks-integration)
8. [Phase 6 — CI/CD, Linting & Formatting](#phase-6--cicd-linting--formatting)
9. [Phase 7 — Testing Infrastructure](#phase-7--testing-infrastructure)
10. [Phase 8 — Documentation & CLAUDE.md](#phase-8--documentation--claudemd)
11. [File-by-File Migration Checklist](#file-by-file-migration-checklist)

---

## 1. Current State Analysis

### What COMMUTR v5 Is Today

- **Single-page mobile-first PWA** — a carpooling prototype for Canada
- **All HTML in one file**: `index.html` (~2000+ lines) with 15 screens inline
- **All CSS in one file**: `style.css` (large monolith)
- **All JS in one file**: `app.js` (IIFE with all functions)
- **No build system** — served raw with `npx serve`
- **No TypeScript**, no linter, no formatter, no tests
- **No backend** — purely a frontend prototype
- **PWA setup**: `manifest.json`, `sw.js`, SVG icons

### What claude-organizer Provides (Patterns to Adopt)

| Pattern | Description | How It Applies to COMMUTR |
|---------|-------------|---------------------------|
| Modular `src/` structure | `src/cli/`, `src/config/`, `src/contracts/`, `src/hooks/`, `src/organizer/`, `src/providers/` | Split monolith JS into modules under `src/` |
| TypeScript with strict config | `tsconfig.json`, `tsconfig.build.json` | Add TypeScript for type safety |
| Zod schemas for validation | `src/contracts/schemas/`, `src/validation/models/` | Use Zod for form/API input validation |
| Contracts layer (types + schemas) | Separate types from runtime validators | Define interfaces for rides, users, messages |
| Config management | `src/config/Config.ts`, `.env.example` | Centralize app config, API URLs, feature flags |
| Category-based file organization | `docs/testing/`, `docs/analysis/`, `scripts/checks/` | Organize docs, scripts, and test output |
| PostToolUse hooks | Auto-organize files after Claude edits | Keep workspace clean during development |
| CI/CD with GitHub Actions | `.github/workflows/` | Automate build, lint, test on push/PR |
| Vitest for testing | `vitest.config.*`, `test/` | Unit + integration tests for all modules |
| ESLint v9 + Prettier | `eslint.config.js`, `.prettierrc` | Consistent code style |
| Husky + lint-staged | `.husky/`, `lint-staged` config in `package.json` | Pre-commit quality gates |
| Comprehensive skip patterns | Protect README, LICENSE, configs from auto-move | Safe defaults for file organization |
| Organization logging | `docs/organization-log.json` | Audit trail for file moves |

---

## 2. Target Project Structure

```
COMMUTR-v5/
├── .claude/                      # Claude Code configuration
│   └── settings.json             # Hooks, permissions
├── .env                          # Local environment variables (gitignored)
├── .env.example                  # Template for env vars
├── .eslintrc.cjs                 # ESLint config (or eslint.config.js for v9)
├── .github/
│   └── workflows/
│       ├── ci.yml                # Build + lint + test on PR
│       └── deploy.yml            # Deploy to GitHub Pages / Vercel
├── .gitignore                    # Updated with comprehensive patterns
├── .husky/
│   └── pre-commit                # lint-staged hook
├── .prettierrc                   # Prettier config
├── .prettierignore               # Files Prettier should skip
├── CLAUDE.md                     # Project instructions for Claude Code
├── CHANGELOG.md                  # Version history
├── LICENSE                       # MIT (already exists)
├── README.md                     # Updated project overview
├── organizing.md                 # THIS FILE — migration plan
├── package.json                  # Updated with all scripts & deps
├── tsconfig.json                 # TypeScript config
├── tsconfig.build.json           # Build-specific TS config
├── vitest.config.ts              # Test runner config
├── vite.config.ts                # Build tool config
│
├── public/                       # Static assets served as-is
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service worker
│   ├── favicon.ico               # Favicon
│   └── icons/
│       ├── apple-touch-icon.svg
│       ├── icon-192.svg
│       └── icon-512.svg
│
├── src/                          # SOURCE CODE (TypeScript)
│   ├── index.ts                  # App entry point
│   │
│   ├── config/                   # Configuration
│   │   ├── constants.ts          # App-wide constants (routes, screen IDs, etc.)
│   │   ├── env.ts                # Environment variable loader
│   │   └── categories.ts         # Ride categories, cities, etc.
│   │
│   ├── contracts/                # Types & validation schemas
│   │   ├── types/
│   │   │   ├── Ride.ts           # Ride interface
│   │   │   ├── User.ts           # User interface
│   │   │   ├── Message.ts        # Chat message interface
│   │   │   ├── Booking.ts        # Booking interface
│   │   │   └── Screen.ts         # Screen/route types
│   │   └── schemas/
│   │       ├── rideSchema.ts     # Zod schema for ride validation
│   │       ├── userSchema.ts     # Zod schema for user validation
│   │       └── searchSchema.ts   # Zod schema for search params
│   │
│   ├── screens/                  # UI screen modules (one per screen)
│   │   ├── onboarding.ts         # s-ob
│   │   ├── signup.ts             # s-signup
│   │   ├── home.ts               # s-home
│   │   ├── search.ts             # s-search
│   │   ├── postRide.ts           # s-post
│   │   ├── rideDetail.ts         # s-detail
│   │   ├── chat.ts               # s-chat
│   │   ├── inbox.ts              # s-inbox
│   │   ├── profile.ts            # s-profile
│   │   ├── dashboard.ts          # s-dashboard
│   │   ├── notifications.ts      # s-notifs
│   │   ├── history.ts            # s-history
│   │   ├── settings.ts           # s-settings
│   │   ├── sos.ts                # s-sos
│   │   └── subscription.ts       # s-sub
│   │
│   ├── components/               # Reusable UI components
│   │   ├── navigation.ts         # Desktop nav + mobile bottom nav
│   │   ├── rideCard.ts           # Ride listing card
│   │   ├── toast.ts              # Toast notification
│   │   ├── modal.ts              # Modal dialog
│   │   ├── starRating.ts         # Star rating widget
│   │   ├── chipSelector.ts       # Chip/tag selector
│   │   └── otpInput.ts           # OTP verification input
│   │
│   ├── services/                 # Business logic & API layer
│   │   ├── api.ts                # HTTP client wrapper (fetch)
│   │   ├── authService.ts        # Login, signup, OTP verification
│   │   ├── rideService.ts        # Ride CRUD, search, booking
│   │   ├── chatService.ts        # Messaging
│   │   ├── userService.ts        # Profile, verification
│   │   ├── notificationService.ts # Push notifications
│   │   └── paymentService.ts     # Payment processing
│   │
│   ├── utils/                    # Shared utilities
│   │   ├── dom.ts                # DOM helpers (byId, qsa, escapeHtml)
│   │   ├── router.ts             # Screen navigation (go function)
│   │   ├── storage.ts            # localStorage wrapper
│   │   ├── format.ts             # Date, currency, distance formatters
│   │   └── validation.ts         # Input sanitization helpers
│   │
│   └── styles/                   # CSS split by concern
│       ├── base.css              # Reset, variables, typography
│       ├── layout.css            # Grid, flex utilities, responsive
│       ├── components.css        # Component-specific styles
│       ├── screens.css           # Screen-specific styles
│       ├── navigation.css        # Nav bar styles
│       └── animations.css        # Transitions, keyframes
│
├── server/                       # BACKEND (Node.js + Express)
│   ├── index.ts                  # Server entry point
│   ├── config/
│   │   └── database.ts           # DB connection config
│   ├── routes/
│   │   ├── authRoutes.ts         # POST /api/auth/login, /signup, /verify-otp
│   │   ├── rideRoutes.ts         # CRUD /api/rides
│   │   ├── bookingRoutes.ts      # POST /api/bookings
│   │   ├── chatRoutes.ts         # GET/POST /api/messages
│   │   └── userRoutes.ts         # GET/PUT /api/users/:id
│   ├── middleware/
│   │   ├── auth.ts               # JWT verification
│   │   ├── validation.ts         # Request body validation (Zod)
│   │   ├── rateLimit.ts          # Rate limiting
│   │   └── errorHandler.ts       # Global error handler
│   ├── models/                   # Database models
│   │   ├── User.ts
│   │   ├── Ride.ts
│   │   ├── Booking.ts
│   │   └── Message.ts
│   └── services/                 # Server-side business logic
│       ├── authService.ts
│       ├── rideService.ts
│       └── notificationService.ts
│
├── docs/                         # Project documentation (auto-organized)
│   ├── testing/                  # Test results and reports
│   ├── architecture/             # System design docs, diagrams
│   ├── troubleshooting/          # Debug notes, issue investigations
│   ├── planning/                 # Specs, roadmaps
│   ├── operations/               # Deployment guides
│   └── organization-log.json     # File move audit trail
│
├── scripts/                      # Utility scripts (auto-organized)
│   ├── checks/                   # Validation scripts
│   ├── setup/                    # Setup/init scripts
│   ├── deployment/               # Deploy scripts
│   └── database/                 # Migration/seed scripts
│
└── test/                         # Tests
    ├── unit/
    │   ├── utils/
    │   │   ├── dom.test.ts
    │   │   ├── router.test.ts
    │   │   └── format.test.ts
    │   ├── services/
    │   │   ├── rideService.test.ts
    │   │   └── authService.test.ts
    │   └── contracts/
    │       └── schemas.test.ts
    ├── integration/
    │   ├── api/
    │   │   ├── rides.test.ts
    │   │   └── auth.test.ts
    │   └── services/
    │       └── rideService.test.ts
    └── e2e/
        ├── onboarding.test.ts
        ├── search.test.ts
        └── booking.test.ts
```

---

## Phase 1 — File Organization & Directory Setup

**Goal**: Create the directory skeleton and move existing files into place.

### Steps

- [ ] **1.1** Create the directory tree:
  ```
  mkdir -p src/{config,contracts/types,contracts/schemas,screens,components,services,utils,styles}
  mkdir -p server/{config,routes,middleware,models,services}
  mkdir -p public/icons
  mkdir -p docs/{testing,architecture,troubleshooting,planning,operations}
  mkdir -p scripts/{checks,setup,deployment,database}
  mkdir -p test/{unit/utils,unit/services,unit/contracts,integration/api,integration/services,e2e}
  mkdir -p .github/workflows
  mkdir -p .husky
  ```

- [ ] **1.2** Move static assets to `public/`:
  - `manifest.json` → `public/manifest.json`
  - `sw.js` → `public/sw.js`
  - `icons/` → `public/icons/`

- [ ] **1.3** Move and update `index.html`:
  - Move to `public/index.html` OR keep at root for Vite (root is Vite default)
  - Strip all inline screen markup (will be generated by screen modules)
  - Keep the shell: `<head>`, SVG defs, nav, `<div id="app">`, bottom nav, script tag

- [ ] **1.4** Create `.gitignore` with comprehensive patterns (from claude-organizer's Config.ts skip patterns):
  ```
  node_modules/
  dist/
  build/
  .env
  .env.local
  .env.*.local
  coverage/
  *.log
  .DS_Store
  Thumbs.db
  .cache/
  .vite/
  ```

- [ ] **1.5** Create `.env.example`:
  ```
  # COMMUTR Configuration
  NODE_ENV=development
  PORT=3000
  API_BASE_URL=http://localhost:3000/api
  DATABASE_URL=
  JWT_SECRET=
  CLAUDE_ORGANIZE_DEBUG=false
  CLAUDE_ORGANIZE_BYPASS=false
  ```

---

## Phase 2 — Frontend Modularization

**Goal**: Break the monolith `app.js`, `style.css`, and `index.html` into modules.

### Steps

- [ ] **2.1** Extract utility functions from `app.js` → `src/utils/`:
  - `byId()`, `qsa()`, `screenElement()` → `src/utils/dom.ts`
  - `escapeHtml()` → `src/utils/dom.ts`
  - `go()`, `updateNavState()` → `src/utils/router.ts`
  - `showToast()` → `src/components/toast.ts`

- [ ] **2.2** Extract screen logic into `src/screens/`:
  - Each screen gets its own module with `init()`, `render()`, `destroy()` functions
  - `updateOnboarding()`, `obNext()` → `src/screens/onboarding.ts`
  - `chipSel()`, `stepChg()` → `src/screens/postRide.ts`
  - `setStar()`, `submitRating()` → `src/components/starRating.ts`
  - `addEmoji()`, `sendMsg()` → `src/screens/chat.ts`
  - `showOTP()`, `otpMove()` → `src/components/otpInput.ts`
  - `segSel()` → `src/components/chipSelector.ts`

- [ ] **2.3** Extract reusable components into `src/components/`:
  - Navigation (desktop + mobile) → `src/components/navigation.ts`
  - Ride card rendering → `src/components/rideCard.ts`
  - Modal → `src/components/modal.ts`

- [ ] **2.4** Split `style.css` into modular CSS:
  - CSS custom properties & reset → `src/styles/base.css`
  - Layout utilities → `src/styles/layout.css`
  - Component styles → `src/styles/components.css`
  - Screen-specific → `src/styles/screens.css`
  - Navigation → `src/styles/navigation.css`
  - Animations → `src/styles/animations.css`

- [ ] **2.5** Create the main entry point `src/index.ts`:
  ```typescript
  import './styles/base.css'
  import './styles/layout.css'
  import './styles/components.css'
  import './styles/screens.css'
  import './styles/navigation.css'
  import './styles/animations.css'
  import { initRouter } from './utils/router'
  import { initNavigation } from './components/navigation'

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation()
    initRouter()
  })
  ```

- [ ] **2.6** Define TypeScript interfaces in `src/contracts/types/`:
  - `Ride.ts`: origin, destination, date, time, seats, price, driver
  - `User.ts`: id, name, email, avatar, rating, verified
  - `Message.ts`: id, senderId, content, timestamp
  - `Booking.ts`: rideId, passengerId, status, seats
  - `Screen.ts`: all screen name types as a union

- [ ] **2.7** Create Zod validation schemas in `src/contracts/schemas/`:
  - `rideSchema.ts`: validate ride creation/search forms
  - `userSchema.ts`: validate signup, profile update
  - `searchSchema.ts`: validate search parameters

- [ ] **2.8** Create config constants in `src/config/`:
  - `constants.ts`: screen IDs, API endpoints, feature flags
  - `categories.ts`: ride categories (intercity routes, cities)

---

## Phase 3 — Backend Setup (Node.js/Express)

**Goal**: Create a real API backend.

### Steps

- [ ] **3.1** Install backend dependencies:
  ```
  npm install express cors helmet dotenv zod jsonwebtoken bcryptjs
  npm install -D @types/express @types/cors @types/jsonwebtoken @types/bcryptjs
  ```

- [ ] **3.2** Create `server/index.ts` — Express server entry point:
  - CORS, Helmet, JSON body parser
  - Route mounting under `/api/`
  - Global error handler middleware
  - Rate limiting on auth routes

- [ ] **3.3** Create route handlers in `server/routes/`:
  - `authRoutes.ts`: POST `/api/auth/signup`, `/api/auth/login`, `/api/auth/verify-otp`
  - `rideRoutes.ts`: GET `/api/rides`, GET `/api/rides/:id`, POST `/api/rides`, PUT `/api/rides/:id`
  - `bookingRoutes.ts`: POST `/api/bookings`, GET `/api/bookings/mine`
  - `chatRoutes.ts`: GET `/api/messages/:conversationId`, POST `/api/messages`
  - `userRoutes.ts`: GET `/api/users/:id`, PUT `/api/users/:id`

- [ ] **3.4** Create middleware in `server/middleware/`:
  - `auth.ts`: JWT token verification
  - `validation.ts`: Generic Zod request-body validator
  - `rateLimit.ts`: Rate limiter (express-rate-limit)
  - `errorHandler.ts`: Centralized error response formatting

- [ ] **3.5** Create frontend services in `src/services/`:
  - `api.ts`: Base fetch wrapper with auth headers, error handling
  - `authService.ts`: Call auth endpoints
  - `rideService.ts`: Call ride endpoints
  - `chatService.ts`: Call message endpoints
  - `userService.ts`: Call user endpoints

- [ ] **3.6** Update `package.json` scripts:
  ```json
  {
    "scripts": {
      "dev": "vite",
      "dev:server": "tsx watch server/index.ts",
      "dev:all": "concurrently \"npm run dev\" \"npm run dev:server\"",
      "build": "tsc && vite build",
      "preview": "vite preview",
      "start": "node dist/server/index.js"
    }
  }
  ```

---

## Phase 4 — Build Tooling & TypeScript

**Goal**: Add Vite + TypeScript for modern build pipeline.

### Steps

- [ ] **4.1** Install build tools:
  ```
  npm install -D vite typescript tsx concurrently
  ```

- [ ] **4.2** Create `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "module": "ESNext",
      "moduleResolution": "bundler",
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true,
      "isolatedModules": true,
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "skipLibCheck": true,
      "outDir": "dist",
      "rootDir": ".",
      "paths": {
        "@/*": ["./src/*"],
        "@server/*": ["./server/*"]
      }
    },
    "include": ["src/**/*.ts", "server/**/*.ts"],
    "exclude": ["node_modules", "dist", "test"]
  }
  ```

- [ ] **4.3** Create `tsconfig.build.json` (extends base, excludes tests).

- [ ] **4.4** Create `vite.config.ts`:
  ```typescript
  import { defineConfig } from 'vite'
  import { resolve } from 'path'

  export default defineConfig({
    root: '.',
    publicDir: 'public',
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: resolve(__dirname, 'index.html'),
      },
    },
    resolve: {
      alias: { '@': resolve(__dirname, 'src') },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': 'http://localhost:3001',
      },
    },
  })
  ```

---

## Phase 5 — Claude Code Hooks Integration

**Goal**: Set up `claude-organize` hooks to auto-organize files during development.

### Steps

- [ ] **5.1** Install claude-organize:
  ```
  npm install -g claude-organize
  ```

- [ ] **5.2** Create `.claude/settings.json` with PostToolUse hook:
  ```json
  {
    "hooks": {
      "PostToolUse": [
        {
          "matcher": "Write|Edit|MultiEdit",
          "hooks": [
            {
              "type": "command",
              "command": "claude-organize"
            }
          ]
        }
      ]
    }
  }
  ```

- [ ] **5.3** Create `.env` with organization settings:
  ```
  CLAUDE_ORGANIZE_DEBUG=false
  CLAUDE_ORGANIZE_BYPASS=false
  CLAUDE_ORGANIZE_SKIP_PATTERNS=README.md,LICENSE,CLAUDE.md,package.json,package-lock.json,tsconfig*.json,vite.config.ts,vitest.config.ts,.eslintrc*,.prettierrc*,index.html
  ```

- [ ] **5.4** Verify skip patterns protect all config/source files from being auto-moved.

---

## Phase 6 — CI/CD, Linting & Formatting

**Goal**: Enforce code quality with automated tools.

### Steps

- [ ] **6.1** Install linting/formatting tools:
  ```
  npm install -D eslint @eslint/js @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier prettier husky lint-staged
  ```

- [ ] **6.2** Create `eslint.config.js` (ESLint v9 flat config):
  - TypeScript parser
  - Recommended rules
  - Prettier integration
  - Custom rules for COMMUTR conventions

- [ ] **6.3** Create `.prettierrc`:
  ```json
  {
    "semi": false,
    "singleQuote": true,
    "trailingComma": "all",
    "printWidth": 100,
    "tabWidth": 2
  }
  ```

- [ ] **6.4** Create `.prettierignore`:
  ```
  dist/
  coverage/
  node_modules/
  public/icons/
  *.svg
  ```

- [ ] **6.5** Add lint-staged to `package.json`:
  ```json
  {
    "lint-staged": {
      "*.{js,ts,json,md,yml,yaml}": "prettier --write",
      "*.{js,ts}": "eslint --fix"
    }
  }
  ```

- [ ] **6.6** Set up Husky pre-commit hook:
  ```
  npx husky init
  echo "npx lint-staged" > .husky/pre-commit
  ```

- [ ] **6.7** Create `.github/workflows/ci.yml`:
  ```yaml
  name: CI
  on: [push, pull_request]
  jobs:
    build-and-test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
        - run: npm ci
        - run: npm run lint:check
        - run: npm run format:check
        - run: npm run typecheck
        - run: npm run test
        - run: npm run build
  ```

- [ ] **6.8** Add scripts to `package.json`:
  ```json
  {
    "scripts": {
      "lint": "eslint . --fix",
      "lint:check": "eslint .",
      "format": "prettier --write .",
      "format:check": "prettier --check .",
      "typecheck": "tsc --noEmit"
    }
  }
  ```

---

## Phase 7 — Testing Infrastructure

**Goal**: Set up Vitest with proper test categories matching claude-organizer patterns.

### Steps

- [ ] **7.1** Install testing tools:
  ```
  npm install -D vitest @vitest/coverage-v8 @vitest/ui
  ```

- [ ] **7.2** Create `vitest.config.ts`:
  ```typescript
  import { defineConfig } from 'vitest/config'
  import { resolve } from 'path'

  export default defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        thresholds: { lines: 80, functions: 80, branches: 80 },
      },
      include: ['test/**/*.test.ts'],
    },
    resolve: {
      alias: { '@': resolve(__dirname, 'src') },
    },
  })
  ```

- [ ] **7.3** Add test scripts to `package.json`:
  ```json
  {
    "scripts": {
      "test": "vitest run",
      "test:watch": "vitest",
      "test:coverage": "vitest run --coverage",
      "test:ui": "vitest --ui"
    }
  }
  ```

- [ ] **7.4** Write initial unit tests:
  - `test/unit/utils/dom.test.ts` — test `byId`, `qsa`, `escapeHtml`
  - `test/unit/utils/router.test.ts` — test screen navigation
  - `test/unit/contracts/schemas.test.ts` — test Zod schemas
  - `test/unit/services/rideService.test.ts` — test with mocked API

- [ ] **7.5** Write initial integration tests:
  - `test/integration/api/rides.test.ts` — test ride API endpoints
  - `test/integration/api/auth.test.ts` — test auth flow

- [ ] **7.6** (Future) Set up E2E with Playwright:
  - `test/e2e/onboarding.test.ts` — test onboarding flow
  - `test/e2e/search.test.ts` — test ride search
  - `test/e2e/booking.test.ts` — test booking flow

---

## Phase 8 — Documentation & CLAUDE.md

**Goal**: Create project documentation following claude-organizer patterns.

### Steps

- [ ] **8.1** Create `CLAUDE.md` — instructions for Claude Code sessions:
  ```markdown
  # COMMUTR v5

  ## Project Overview
  Canadian intercity carpooling PWA with TypeScript frontend + Express backend.

  ## Commands
  - `npm run dev` — Start Vite dev server (frontend)
  - `npm run dev:server` — Start Express API (backend)
  - `npm run dev:all` — Run both concurrently
  - `npm run build` — Production build
  - `npm run test` — Run all tests
  - `npm run lint` — Lint and auto-fix

  ## Architecture
  - Frontend: Vite + TypeScript, modular screens in src/screens/
  - Backend: Express + TypeScript in server/
  - Validation: Zod schemas in src/contracts/schemas/
  - Tests: Vitest in test/

  ## Conventions
  - DO NOT create scripts in root directory
  - Put test files in test/, not alongside source
  - All new files must be TypeScript (.ts)
  - Use Zod for all input validation
  - Screen modules export init(), render(), destroy()

  ## File Organization
  Files are automatically organized by claude-organize hooks.
  Protected files: README.md, LICENSE, CLAUDE.md, package.json, configs
  ```

- [ ] **8.2** Update `README.md` with:
  - Project description and features
  - Getting started / installation steps
  - Available npm scripts
  - Architecture overview
  - Contributing guidelines

- [ ] **8.3** Create `CHANGELOG.md` starting from v5.0.0.

- [ ] **8.4** Create `docs/architecture/` diagrams:
  - Frontend module dependency diagram
  - API route map
  - Data flow diagram

---

## File-by-File Migration Checklist

This is the execution order for actually moving/creating files:

### Round 1 — Infrastructure (no code changes)

| # | Action | Source | Destination |
|---|--------|--------|-------------|
| 1 | Create | — | `.gitignore` |
| 2 | Create | — | `.env.example` |
| 3 | Create | — | `CLAUDE.md` |
| 4 | Create | — | `tsconfig.json` |
| 5 | Create | — | `tsconfig.build.json` |
| 6 | Create | — | `vite.config.ts` |
| 7 | Create | — | `vitest.config.ts` |
| 8 | Create | — | `.prettierrc` |
| 9 | Create | — | `.prettierignore` |
| 10 | Create | — | `eslint.config.js` |
| 11 | Update | `package.json` | Add all deps, scripts |
| 12 | Run | — | `npm install` |

### Round 2 — Static Assets

| # | Action | Source | Destination |
|---|--------|--------|-------------|
| 13 | Move | `icons/*` | `public/icons/*` |
| 14 | Move | `manifest.json` | `public/manifest.json` |
| 15 | Move | `sw.js` | `public/sw.js` |
| 16 | Update | `sw.js` | Fix cache paths for new structure |

### Round 3 — Frontend Source Extraction

| # | Action | Source | Destination |
|---|--------|--------|-------------|
| 17 | Extract | `app.js` → DOM utils | `src/utils/dom.ts` |
| 18 | Extract | `app.js` → router | `src/utils/router.ts` |
| 19 | Extract | `app.js` → toast | `src/components/toast.ts` |
| 20 | Extract | `app.js` → onboarding | `src/screens/onboarding.ts` |
| 21 | Extract | `app.js` → each screen | `src/screens/*.ts` (13 more) |
| 22 | Extract | `app.js` → components | `src/components/*.ts` |
| 23 | Create | — | `src/index.ts` (entry) |
| 24 | Create | — | `src/config/constants.ts` |

### Round 4 — CSS Modularization

| # | Action | Source | Destination |
|---|--------|--------|-------------|
| 25 | Extract | `style.css` → variables & reset | `src/styles/base.css` |
| 26 | Extract | `style.css` → layout | `src/styles/layout.css` |
| 27 | Extract | `style.css` → components | `src/styles/components.css` |
| 28 | Extract | `style.css` → screens | `src/styles/screens.css` |
| 29 | Extract | `style.css` → nav | `src/styles/navigation.css` |
| 30 | Extract | `style.css` → animations | `src/styles/animations.css` |

### Round 5 — Types & Contracts

| # | Action | Source | Destination |
|---|--------|--------|-------------|
| 31 | Create | — | `src/contracts/types/Ride.ts` |
| 32 | Create | — | `src/contracts/types/User.ts` |
| 33 | Create | — | `src/contracts/types/Message.ts` |
| 34 | Create | — | `src/contracts/types/Booking.ts` |
| 35 | Create | — | `src/contracts/types/Screen.ts` |
| 36 | Create | — | `src/contracts/schemas/rideSchema.ts` |
| 37 | Create | — | `src/contracts/schemas/userSchema.ts` |
| 38 | Create | — | `src/contracts/schemas/searchSchema.ts` |

### Round 6 — Backend

| # | Action | Source | Destination |
|---|--------|--------|-------------|
| 39 | Create | — | `server/index.ts` |
| 40 | Create | — | `server/routes/authRoutes.ts` |
| 41 | Create | — | `server/routes/rideRoutes.ts` |
| 42 | Create | — | `server/routes/bookingRoutes.ts` |
| 43 | Create | — | `server/routes/chatRoutes.ts` |
| 44 | Create | — | `server/routes/userRoutes.ts` |
| 45 | Create | — | `server/middleware/auth.ts` |
| 46 | Create | — | `server/middleware/validation.ts` |
| 47 | Create | — | `server/middleware/rateLimit.ts` |
| 48 | Create | — | `server/middleware/errorHandler.ts` |

### Round 7 — Frontend Services

| # | Action | Source | Destination |
|---|--------|--------|-------------|
| 49 | Create | — | `src/services/api.ts` |
| 50 | Create | — | `src/services/authService.ts` |
| 51 | Create | — | `src/services/rideService.ts` |
| 52 | Create | — | `src/services/chatService.ts` |
| 53 | Create | — | `src/services/userService.ts` |

### Round 8 — Hooks & CI

| # | Action | Source | Destination |
|---|--------|--------|-------------|
| 54 | Create | — | `.claude/settings.json` |
| 55 | Create | — | `.github/workflows/ci.yml` |
| 56 | Setup | — | Husky + lint-staged |

### Round 9 — Tests

| # | Action | Source | Destination |
|---|--------|--------|-------------|
| 57 | Create | — | `test/unit/utils/dom.test.ts` |
| 58 | Create | — | `test/unit/utils/router.test.ts` |
| 59 | Create | — | `test/unit/contracts/schemas.test.ts` |
| 60 | Create | — | `test/integration/api/rides.test.ts` |
| 61 | Create | — | `test/integration/api/auth.test.ts` |

### Round 10 — Cleanup

| # | Action | Source | Destination |
|---|--------|--------|-------------|
| 62 | Delete | `app.js` | (replaced by `src/`) |
| 63 | Delete | `style.css` | (replaced by `src/styles/`) |
| 64 | Delete | `icons/` | (moved to `public/icons/`) |
| 65 | Update | `index.html` | Point to new entry, strip inline markup |
| 66 | Verify | — | `npm run build` succeeds |
| 67 | Verify | — | `npm run test` passes |
| 68 | Verify | — | `npm run lint` clean |

---

## Key Decisions & Notes

1. **Vite over Webpack**: Faster dev server, native ESM, simpler config. Aligns with modern TypeScript projects.

2. **Keep index.html at root**: Vite expects `index.html` at project root by default. The `public/` folder is for static assets only.

3. **Contracts pattern from claude-organizer**: Separating types (compile-time) from schemas (runtime validation with Zod) is a proven pattern. Types go in `contracts/types/`, schemas in `contracts/schemas/`.

4. **Screen module pattern**: Each screen exports `init()`, `render()`, and `destroy()` for lifecycle management. This replaces the massive switch/case in the current `go()` function.

5. **Service layer**: Frontend services call the backend API. Backend services contain business logic. Contracts are shared between both layers.

6. **Progressive enhancement**: The PWA service worker (`sw.js`) stays in `public/` and gets updated paths in Round 2.

7. **No database initially**: Start with in-memory data or JSON files. Database can be added later (PostgreSQL/Prisma recommended).

8. **File organization hooks**: Install `claude-organize` globally and configure PostToolUse hooks so any scripts/docs Claude generates are automatically sorted into `scripts/` and `docs/` subdirectories.

---

## Dependency Summary

### Production Dependencies
```
express, cors, helmet, dotenv, zod, jsonwebtoken, bcryptjs
```

### Dev Dependencies
```
typescript, vite, tsx, concurrently,
vitest, @vitest/coverage-v8, @vitest/ui,
eslint, @eslint/js, @typescript-eslint/eslint-plugin, @typescript-eslint/parser,
eslint-config-prettier, prettier,
husky, lint-staged,
@types/express, @types/cors, @types/jsonwebtoken, @types/bcryptjs, @types/node
```

---

*This plan was generated by analyzing the COMMUTR v5 codebase and the claude-organizer repository patterns. Execute the phases sequentially — each builds on the previous. Commit after each phase.*
