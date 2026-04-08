import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

import { authRouter } from './routes/auth.js'
import { ridesRouter } from './routes/rides.js'
import { chatRouter } from './routes/chat.js'
import { errorHandler } from './middleware/errorHandler.js'

const PORT = parseInt(process.env['PORT'] ?? '3001', 10)
const CLIENT_ORIGIN = process.env['CLIENT_ORIGIN'] ?? 'http://localhost:3000'

const app = express()

// ─── Security middleware ───────────────────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
)

// ─── Rate limiting ─────────────────────────────────────────────────────────
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  }),
)

// ─── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '64kb' }))

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter)
app.use('/api/rides', ridesRouter)
app.use('/api/chat', chatRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Error handler ─────────────────────────────────────────────────────────
app.use(errorHandler)

// ─── Start ────────────────────────────────────────────────────────────────
if (process.env['NODE_ENV'] !== 'test') {
  app.listen(PORT, () => {
    console.warn(`COMMUTR API running on http://localhost:${PORT}`)
  })
}

export default app
