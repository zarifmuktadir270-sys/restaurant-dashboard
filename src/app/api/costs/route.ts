import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { prisma } = await import('@/lib/db')
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const costs = await prisma.cost.findMany({
      where: { date: { gte: startOfMonth } },
      include: { restaurant: { select: { name: true } } },
      orderBy: { date: 'desc' },
    })

    const totalCost = costs.reduce((sum: number, c: any) => sum + c.cost, 0)

    const byRestaurant: Record<string, { name: string; cost: number; tokens: number }> = {}
    for (const c of costs) {
      if (!byRestaurant[c.restaurantId]) {
        byRestaurant[c.restaurantId] = { name: c.restaurant.name, cost: 0, tokens: 0 }
      }
      byRestaurant[c.restaurantId].cost += c.cost
      byRestaurant[c.restaurantId].tokens += c.tokensIn + c.tokensOut
    }

    const byDate: Record<string, number> = {}
    for (const c of costs) {
      const date = c.date.toISOString().split('T')[0]
      byDate[date] = (byDate[date] || 0) + c.cost
    }

    return NextResponse.json({
      totalCost,
      byRestaurant: Object.values(byRestaurant),
      byDate: Object.entries(byDate).map(([date, cost]) => ({ date, cost })),
      costCount: costs.length,
    })
  } catch (error) {
    return NextResponse.json({ totalCost: 0, byRestaurant: [], byDate: [], costCount: 0 })
  }
}
