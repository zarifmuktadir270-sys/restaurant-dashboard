/**
 * OpenClaw Gateway Connection Library
 * Talks to each restaurant's OpenClaw instance via its API
 */

const OPENCLAW_BASE_PORT = parseInt(process.env.OPENCLAW_BASE_PORT || '3001')

interface OpenClawHealth {
  status: string
  version?: string
  uptime?: number
}

interface OpenClawSession {
  id: string
  key: string
  model: string
  messageCount: number
  createdAt: string
  lastActiveAt: string
}

interface OpenClawUsage {
  totalTokens: number
  totalCost: number
  requests: number
  byModel: Record<string, { tokens: number; cost: number }>
}

function getBaseUrl(port: number): string {
  return `http://127.0.0.1:${port}`
}

async function fetchOpenClaw(port: number, path: string, options?: RequestInit) {
  try {
    const res = await fetch(`${getBaseUrl(port)}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function checkHealth(port: number): Promise<OpenClawHealth | null> {
  return fetchOpenClaw(port, '/api/health')
}

export async function getSessions(port: number): Promise<OpenClawSession[]> {
  const data = await fetchOpenClaw(port, '/api/sessions')
  return Array.isArray(data) ? data : []
}

export async function getUsage(port: number): Promise<OpenClawUsage | null> {
  return fetchOpenClaw(port, '/api/usage')
}

export async function sendMessage(port: number, sessionId: string, message: string) {
  return fetchOpenClaw(port, `/api/sessions/${sessionId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
}

export async function getStatus(port: number) {
  const health = await checkHealth(port)
  const sessions = await getSessions(port)
  const usage = await getUsage(port)

  return {
    online: health !== null,
    health,
    sessions,
    usage,
    activeSessions: sessions.length,
    lastActive: sessions.length > 0
      ? sessions.sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime())[0].lastActiveAt
      : null,
  }
}

// Check all restaurants at once
export async function checkAllAgents(restaurants: Array<{ id: string; port: number | null }>) {
  const results = await Promise.all(
    restaurants.map(async (r) => {
      if (!r.port) return { id: r.id, online: false, sessions: 0, cost: 0 }
      const status = await getStatus(r.port)
      return {
        id: r.id,
        online: status.online,
        sessions: status.activeSessions,
        cost: status.usage?.totalCost || 0,
        lastActive: status.lastActive,
      }
    })
  )
  return results
}

export { OPENCLAW_BASE_PORT }
