import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash('password123', 12)

  const driver = await prisma.user.upsert({
    where: { email: 'driver@commutr.ca' },
    update: {},
    create: {
      name: 'Priya K.',
      email: 'driver@commutr.ca',
      passwordHash,
      verified: true,
      verifiedId: true,
      ratingAvg: 4.9,
      ratingCount: 142,
      role: 'driver',
    },
  })

  await prisma.subscription.upsert({
    where: { userId: driver.id },
    update: {},
    create: { userId: driver.id, plan: 'pro', status: 'active' },
  })

  const departureAt = new Date()
  departureAt.setDate(departureAt.getDate() + 3)
  departureAt.setHours(8, 0, 0, 0)

  await prisma.ride.upsert({
    where: { id: 'seed-ride-toronto-ottawa' },
    update: {},
    create: {
      id: 'seed-ride-toronto-ottawa',
      driverId: driver.id,
      origin: 'Toronto, ON',
      destination: 'Ottawa, ON',
      departureAt: departureAt.toISOString(),
      pricePerSeat: 25,
      seatsTotal: 3,
      seatsAvailable: 2,
      stops: '[]',
      amenities: JSON.stringify(['noSmoking']),
      status: 'active',
    },
  })

  console.warn('Seed complete: driver@commutr.ca / password123')
}

main()
  .catch((e: unknown) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
