# COMMUTR v5

Canada's fee-free intercity carpooling PWA. Mobile-first, dark themed, with a TypeScript frontend (Vite) and Express API backed by SQLite (dev) or Postgres (production).

## Quick start

```bash
pnpm install --frozen-lockfile
cp .env.example .env
# Edit JWT_SECRET (≥32 characters)

pnpm exec prisma generate
pnpm exec prisma migrate deploy   # or: pnpm exec prisma db push
pnpm db:seed

pnpm dev:all   # Vite :3000 + API :3001
```

Open http://localhost:3000 — use `?screen=search` for deep links.

## Scripts

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `pnpm dev`        | Vite dev server                                |
| `pnpm dev:server` | Express API                                    |
| `pnpm dev:all`    | Both                                           |
| `pnpm build`      | Production build → `dist/client/`              |
| `pnpm test`       | Vitest unit + integration                      |
| `pnpm test:e2e`   | Playwright (run `pnpm test:e2e:install` first) |
| `pnpm db:seed`    | Demo driver + admin users                      |

## Architecture

| Layer    | Stack                                           |
| -------- | ----------------------------------------------- |
| Frontend | Vite, vanilla TS modules, event delegation, PWA |
| API      | Express, JWT + httpOnly cookie, Zod validation  |
| DB       | Prisma ORM (SQLite dev, Postgres prod)          |
| Deploy   | GitHub Pages (PWA) + separate API host          |

### Key API routes

- `POST /api/auth/register|login|logout` — `GET /api/auth/me`
- `GET|POST /api/rides` — `POST /api/rides/:id/seat-requests`
- `GET|POST /api/seat-requests/...` (accept/reject/cancel/confirm)
- `GET|POST /api/chat/conversations`
- `GET /api/subscription/me`
- `POST /api/reports` — `POST|DELETE /api/blocks`
- `GET|POST|DELETE /api/route-alerts`
- `GET /api/admin/reports` (admin role)

## Environment

See `.env.example`. Required: `JWT_SECRET` (≥32 chars). Tests use `DATABASE_URL=file:./test.db`.

## Product & trust copy

- **Cost share**, not fare — drivers and passengers pay each other directly.
- **No COMMUTR booking fee** on passenger requests.
- **No fake badges** — verification flags come from the database only.
- **Price guardrails** warn on unusually high per-seat amounts.

## Seed accounts

| Email               | Password                   | Role         |
| ------------------- | -------------------------- | ------------ |
| `driver@commutr.ca` | `password123`              | driver (Pro) |
| `admin@commutr.ca`  | `admin-password-change-me` | admin        |

## License

MIT — see [LICENSE](LICENSE).
