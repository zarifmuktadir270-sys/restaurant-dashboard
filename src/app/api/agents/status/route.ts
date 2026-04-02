import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { prisma } = await import('@/lib/db')
    const restaurants = await prisma.restaurant.findMany({
      select: { id: true, name: true, port: true, status: true },
    })

    // For now, return DB status (real-time check happens client-side)
    const agents = restaurants.map((r: any) => ({
      id: r.id,
      name: r.name,
      port: r.port,
      dbStatus: r.status,
      realStatus: r.status === 'active' ? 'running' : 'offline',
      activeSessions: 0,
      realCost: 0,
      lastActive: null,
    }))

    return NextResponse.json({ agents, checkedAt: new Date().toISOString() })
  } catch (error) {
    return NextResponse.json({ agents: [] })
  }
}
