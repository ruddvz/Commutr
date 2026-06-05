import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../../../server/index.js'
import { prisma } from '../../../server/db/client.js'

async function registerDriver(): Promise<string> {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Driver',
      email: `driver-${Date.now()}@example.com`,
      password: 'password123',
    })
  return res.body.data.token as string
}

describe('Rides API', () => {
  beforeEach(async () => {
    await prisma.message.deleteMany()
    await prisma.conversationParticipant.deleteMany()
    await prisma.conversation.deleteMany()
    await prisma.seatRequest.deleteMany()
    await prisma.ride.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.user.deleteMany()
  })

  it('creates a ride with seatsAvailable equal to seatsTotal', async () => {
    const token = await registerDriver()
    const departureAt = new Date(Date.now() + 86400000).toISOString()

    const res = await request(app).post('/api/rides').set('Authorization', `Bearer ${token}`).send({
      origin: 'Toronto, ON',
      destination: 'Ottawa, ON',
      departureAt,
      pricePerSeat: 25,
      seatsTotal: 3,
      stops: [],
      amenities: [],
    })

    expect(res.status).toBe(201)
    expect(res.body.data.seatsAvailable).toBe(3)
    expect(res.body.data.seatsTotal).toBe(3)
  })

  it('validates search query params', async () => {
    const res = await request(app).get('/api/rides').query({ seats: 'not-a-number' })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('filters rides by seats via query string', async () => {
    const token = await registerDriver()
    const departureAt = new Date(Date.now() + 86400000).toISOString()

    await request(app).post('/api/rides').set('Authorization', `Bearer ${token}`).send({
      origin: 'London, ON',
      destination: 'Toronto, ON',
      departureAt,
      pricePerSeat: 20,
      seatsTotal: 2,
      stops: [],
      amenities: [],
    })

    const res = await request(app).get('/api/rides').query({ seats: '3' })
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(0)
  })
})
