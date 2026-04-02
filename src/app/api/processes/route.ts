import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { getAllRunningProcesses } = await import('@/lib/process-manager')
    const processes = getAllRunningProcesses()
    return NextResponse.json({ running: processes, count: processes.length })
  } catch {
    return NextResponse.json({ running: [], count: 0 })
  }
}
