import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const costs = await prisma.cost.findMany({
      where: { date: { gte: startOfMonth } },
      include: { restaurant: { select: { name: true } } },
    })
    const totalCost = costs.reduce((s: number, c: any) => s + c.cost, 0)
    const byRestaurant: Record<string, any> = {}
    for (const c of costs) {
      if (!byRestaurant[c.restaurantId]) byRestaurant[c.restaurantId] = { name: c.restaurant.name, cost: 0, tokens: 0 }
      byRestaurant[c.restaurantId].cost += c.cost
      byRestaurant[c.restaurantId].tokens += c.tokensIn + c.tokensOut
    }
    return NextResponse.json({ totalCost, byRestaurant: Object.values(byRestaurant), costCount: costs.length })
  } catch { return NextResponse.json({ totalCost: 0, byRestaurant: [], costCount: 0 }) }
}
