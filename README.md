# COMMUTR v5

Canada's fee-free intercity carpooling PWA. Mobile-first, dark themed, with a TypeScript frontend (Vite) and Express API backed by SQLite/Postgres via Prisma.

## Quick start

```bash
pnpm install --frozen-lockfile
cp .env.example .env
# Edit JWT_SECRET (≥32 chars) in .env

pnpm exec prisma generate
pnpm exec prisma db push
pnpm db:seed   # optional demo data

pnpm dev:all   # Vite :3000 + API :3001
```

## Scripts

| Command              | Description                                                    |
| -------------------- | -------------------------------------------------------------- |
| `pnpm dev`           | Vite dev server (port 3000)                                    |
| `pnpm dev:server`    | Express API (port 3001)                                        |
| `pnpm dev:all`       | Both concurrently                                              |
| `pnpm typecheck`     | TypeScript check                                               |
| `pnpm lint:check`    | ESLint                                                         |
| `pnpm format:check`  | Prettier                                                       |
| `pnpm test`          | Vitest                                                         |
| `pnpm test:coverage` | Vitest + coverage                                              |
| `pnpm build`         | Prisma generate + server compile + Vite build → `dist/client/` |

## Architecture

- **Frontend:** Vite + TypeScript (`src/`), PWA via `vite-plugin-pwa`, GitHub Pages base path `/Commutr/`
- **Backend:** Express (`server/`), JWT auth, Zod validation, Prisma ORM
- **Database:** SQLite by default (`DATABASE_URL=file:./data/commutr.db`); use Postgres in production by changing the Prisma datasource

## Deployment

| Component  | Recommended host                                                |
| ---------- | --------------------------------------------------------------- |
| PWA static | GitHub Pages (`dist/client` via `.github/workflows/deploy.yml`) |
| API        | Render, Railway, Fly.io, or similar                             |
| Database   | Managed Postgres                                                |

Set `VITE_API_URL` to your API origin in production builds. Set `CLIENT_ORIGIN` on the API to your PWA URL for CORS.

## Environment

See `.env.example` for all variables. `JWT_SECRET` is required (≥32 characters). Tests use `NODE_ENV=test` with a deterministic test secret.

## Product notes

- Passengers **request seats**; drivers accept/reject. Payment is **direct with the driver** (cash/e-transfer)—COMMUTR does not process booking payments.
- Copy avoids unverified claims (no “secure payments” unless integrated).
- Free drivers: 3 ride posts/month; Pro plan (backend-enforced) allows unlimited posts.

## License

MIT — see [LICENSE](LICENSE).
