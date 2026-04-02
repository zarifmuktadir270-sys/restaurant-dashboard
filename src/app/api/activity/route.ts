import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { restaurant: { select: { name: true } } },
    })
    return NextResponse.json(activities)
  } catch { return NextResponse.json([]) }
}
