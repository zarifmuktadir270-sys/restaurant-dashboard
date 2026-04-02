import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    const activities = await prisma.activity.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { restaurant: { select: { name: true } } },
    })
    await prisma.$disconnect()
    return NextResponse.json(activities)
  } catch (e) {
    console.error('Activity error:', e)
    return NextResponse.json([])
  }
}
