import { NextResponse } from 'next/server'
import { getAllRunningProcesses } from '@/lib/process-manager'

export async function GET() {
  try {
    const processes = getAllRunningProcesses()
    return NextResponse.json({
      running: processes,
      count: processes.length,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get processes' }, { status: 500 })
  }
}
