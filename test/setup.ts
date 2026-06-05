import { beforeAll, afterAll } from 'vitest'

process.env['NODE_ENV'] = 'test'
process.env['JWT_SECRET'] = 'test-jwt-secret-at-least-32-characters-long'
process.env['DATABASE_URL'] = 'file:./test.db'
process.env['CLIENT_ORIGIN'] = 'http://localhost:3000'

beforeAll(async () => {
  const { execSync } = await import('node:child_process')
  execSync('pnpm exec prisma generate', { stdio: 'pipe', env: process.env })
  execSync('pnpm exec prisma db push --skip-generate', {
    stdio: 'pipe',
    env: process.env,
  })
})

afterAll(async () => {
  const { prisma } = await import('../server/db/client.js')
  await prisma.$disconnect()
})
