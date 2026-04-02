import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkAllAgents, getStatus } from '@/lib/openclaw'

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      select: { id: true, name: true, port: true, status: true },
    })

    const agentStatuses = await checkAllAgents(restaurants)

    return NextResponse.json({
      agents: agentStatuses.map((s: any) => {
        const r = restaurants.find((r: any) => r.id === s.id)!
        return {
          ...r,
          realStatus: s.online ? 'running' : 'offline',
          activeSessions: s.sessions,
          realCost: s.cost,
          lastActive: s.lastActive,
        }
      }),
      checkedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check agents' }, { status: 500 })
  }
}
