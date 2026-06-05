import { Router } from 'express'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { prisma } from '../db/client.js'

export const subscriptionRouter = Router()

const FREE_POSTS_PER_MONTH = 3

subscriptionRouter.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!
    let sub = await prisma.subscription.findUnique({ where: { userId } })
    if (!sub) {
      sub = await prisma.subscription.create({
        data: { userId, plan: 'free', status: 'active' },
      })
    }

    const start = new Date()
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
    const postsThisMonth = await prisma.ride.count({
      where: { driverId: userId, createdAt: { gte: start } },
    })

    res.json({
      data: {
        plan: sub.plan,
        status: sub.status,
        postsThisMonth,
        freePostsRemaining:
          sub.plan === 'pro' ? null : Math.max(0, FREE_POSTS_PER_MONTH - postsThisMonth),
        currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null,
      },
    })
  } catch (err) {
    next(err)
  }
})
