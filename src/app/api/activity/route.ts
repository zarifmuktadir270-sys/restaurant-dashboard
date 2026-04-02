import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { restaurant: { select: { name: true } } },
    })
    return NextResponse.json(activities)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
  }
}
