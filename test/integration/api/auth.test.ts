import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../../server/index.js'
import { prisma } from '../../../server/db/client.js'

describe('Auth API', () => {
  beforeEach(async () => {
    await prisma.message.deleteMany()
    await prisma.conversationParticipant.deleteMany()
    await prisma.conversation.deleteMany()
    await prisma.seatRequest.deleteMany()
    await prisma.ride.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.user.deleteMany()
  })

  it('registers and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })
    expect(res.status).toBe(201)
    expect(res.body.data.token).toBeTruthy()
    expect(res.body.data.email).toBe('test@example.com')
  })

  it('rejects duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'First User',
      email: 'dup@example.com',
      password: 'password123',
    })
    const res = await request(app).post('/api/auth/register').send({
      name: 'Other User',
      email: 'dup@example.com',
      password: 'password123',
    })
    expect(res.status).toBe(409)
  })

  it('logs in with valid credentials', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'password123',
    })
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    })
    expect(res.status).toBe(200)
    expect(res.body.data.token).toBeTruthy()
  })
})
