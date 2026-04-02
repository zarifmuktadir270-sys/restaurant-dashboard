import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { prisma } = await import('@/lib/db')
    const activities = await prisma.activity.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { restaurant: { select: { name: true } } },
    })
    return NextResponse.json(activities)
  } catch (error) {
    return NextResponse.json([])
  }
}
