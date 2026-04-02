import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      select: { id: true, name: true, port: true, status: true },
    })
    const agents = restaurants.map((r: any) => ({
      ...r, realStatus: r.status === 'active' ? 'running' : 'offline',
      activeSessions: 0, realCost: 0, lastActive: null,
    }))
    return NextResponse.json({ agents })
  } catch { return NextResponse.json({ agents: [] }) }
}
