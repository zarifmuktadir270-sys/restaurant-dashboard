/**
 * OpenClaw Process Manager
 * Starts, stops, and monitors OpenClaw gateway processes per restaurant
 */

import { exec, spawn, ChildProcess } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

const OPENCLAW_BIN = process.env.OPENCLAW_BIN || 'openclaw'
const RESTAURANTS_DIR = process.env.RESTAURANTS_DIR || path.join(process.cwd(), 'restaurants')
const BASE_PORT = 3001

// Track running processes
const runningProcesses: Map<string, { process: ChildProcess; port: number; startedAt: Date }> = new Map()

export interface StartResult {
  success: boolean
  port: number
  pid?: number
  message: string
}

export interface ProcessStatus {
  running: boolean
  port: number | null
  pid: number | null
  startedAt: string | null
  uptime: number | null
}

function getNextPort(restaurantIndex: number): number {
  return BASE_PORT + restaurantIndex
}

/**
 * Start an OpenClaw gateway for a restaurant
 */
export async function startOpenClaw(
  restaurantId: string,
  restaurantSlug: string,
  restaurantIndex: number = 0
): Promise<StartResult> {
  const restaurantDir = path.join(RESTAURANTS_DIR, restaurantSlug)
  const port = getNextPort(restaurantIndex)

  // Check if already running
  if (runningProcesses.has(restaurantId)) {
    return {
      success: false,
      port,
      message: 'Already running',
    }
  }

  // Ensure directory exists
  try {
    await fs.access(restaurantDir)
  } catch {
    return {
      success: false,
      port,
      message: 'Restaurant directory not found. Click Start to create config first.',
    }
  }

  // Check if port is available
  try {
    await execAsync(`lsof -i:${port} -t`)
    return {
      success: false,
      port,
      message: `Port ${port} is already in use`,
    }
  } catch {
    // Port is free, good
  }

  try {
    // Start OpenClaw process
    const child = spawn(OPENCLAW_BIN, ['gateway', 'start'], {
      env: {
        ...process.env,
        OPENCLAW_HOME: restaurantDir,
        PORT: String(port),
      },
      cwd: restaurantDir,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    const startedAt = new Date()
    runningProcesses.set(restaurantId, { process: child, port, startedAt })

    // Log output
    child.stdout?.on('data', (data) => {
      console.log(`[${restaurantSlug}] ${data.toString().trim()}`)
    })
    child.stderr?.on('data', (data) => {
      console.error(`[${restaurantSlug}] ERROR: ${data.toString().trim()}`)
    })

    child.on('exit', (code) => {
      console.log(`[${restaurantSlug}] Process exited with code ${code}`)
      runningProcesses.delete(restaurantId)
    })

    return {
      success: true,
      port,
      pid: child.pid || undefined,
      message: `OpenClaw started on port ${port}`,
    }
  } catch (error: any) {
    return {
      success: false,
      port,
      message: `Failed to start: ${error.message}`,
    }
  }
}

/**
 * Stop an OpenClaw gateway
 */
export async function stopOpenClaw(restaurantId: string): Promise<{ success: boolean; message: string }> {
  const entry = runningProcesses.get(restaurantId)
  if (!entry) {
    return { success: false, message: 'Not running' }
  }

  try {
    entry.process.kill('SIGTERM')
    runningProcesses.delete(restaurantId)
    return { success: true, message: 'Stopped' }
  } catch (error: any) {
    return { success: false, message: `Failed to stop: ${error.message}` }
  }
}

/**
 * Restart an OpenClaw gateway
 */
export async function restartOpenClaw(
  restaurantId: string,
  restaurantSlug: string,
  restaurantIndex: number = 0
): Promise<StartResult> {
  await stopOpenClaw(restaurantId)
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return startOpenClaw(restaurantId, restaurantSlug, restaurantIndex)
}

/**
 * Get status of a running process
 */
export function getProcessStatus(restaurantId: string): ProcessStatus {
  const entry = runningProcesses.get(restaurantId)
  if (!entry) {
    return { running: false, port: null, pid: null, startedAt: null, uptime: null }
  }

  const uptime = Date.now() - entry.startedAt.getTime()
  return {
    running: true,
    port: entry.port,
    pid: entry.process.pid || null,
    startedAt: entry.startedAt.toISOString(),
    uptime: Math.floor(uptime / 1000),
  }
}

/**
 * Get all running processes
 */
export function getAllRunningProcesses(): Array<{ id: string; port: number; pid: number | null; uptime: number }> {
  const result: Array<{ id: string; port: number; pid: number | null; uptime: number }> = []
  for (const [id, entry] of runningProcesses) {
    result.push({
      id,
      port: entry.port,
      pid: entry.process.pid || null,
      uptime: Math.floor((Date.now() - entry.startedAt.getTime()) / 1000),
    })
  }
  return result
}

/**
 * Kill all processes (for cleanup)
 */
export function stopAll(): void {
  for (const [id, entry] of runningProcesses) {
    try {
      entry.process.kill('SIGTERM')
    } catch {}
  }
  runningProcesses.clear()
}
