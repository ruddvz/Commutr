import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1).default('file:./data/commutr.db'),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
})

export type Env = z.infer<typeof envSchema>

function loadEnv(): Env {
  const isTest = process.env['NODE_ENV'] === 'test'
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env['NODE_ENV'] ?? 'development',
    PORT: process.env['PORT'],
    CLIENT_ORIGIN: process.env['CLIENT_ORIGIN'],
    DATABASE_URL: process.env['DATABASE_URL'],
    JWT_SECRET:
      process.env['JWT_SECRET'] ??
      (isTest ? 'test-jwt-secret-at-least-32-characters-long' : undefined),
    JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'],
    BCRYPT_ROUNDS: process.env['BCRYPT_ROUNDS'],
  })

  if (!parsed.success) {
    const details = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
    console.error(`FATAL: Invalid environment configuration — ${details}`)
    process.exit(1)
  }

  return parsed.data
}

export const env = loadEnv()
