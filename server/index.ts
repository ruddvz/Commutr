import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

import { env } from './config/env.js'
import { authRouter } from './routes/auth.js'
import { ridesRouter } from './routes/rides.js'
import { chatRouter } from './routes/chat.js'
import { seatRequestsRouter } from './routes/seatRequests.js'
import { reportsRouter } from './routes/reports.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
)

app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' },
    },
  }),
)

app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { error: { code: 'RATE_LIMITED', message: 'Too many auth attempts.' } },
  }),
)

app.use(express.json({ limit: '64kb' }))

app.use('/api/auth', authRouter)
app.use('/api/rides', ridesRouter)
app.use('/api/chat', chatRouter)
app.use('/api/seat-requests', seatRequestsRouter)
app.use('/api/reports', reportsRouter)

app.get('/api/health', (_req, res) => {
  res.json({ data: { status: 'ok', timestamp: new Date().toISOString() } })
})

app.use(errorHandler)

if (process.env['NODE_ENV'] !== 'test') {
  app.listen(env.PORT, () => {
    console.warn(`COMMUTR API running on http://localhost:${env.PORT}`)
  })
}

export default app
