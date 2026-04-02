import Docker from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

const BASE_PORT = 3001
const IMAGE = 'node:22-slim' // Replace with openclaw image when available

export interface CreateAgentOptions {
  restaurantId: string
  name: string
  type: string
  ownerName: string
  ownerPhone: string
  posProvider: string
  posToken?: string
  tier: string
}

export async function getUsedPorts(): Promise<number[]> {
  const containers = await docker.listContainers({ all: true })
  const ports: number[] = []
  for (const c of containers) {
    for (const p of c.Ports || []) {
      if (p.PublicPort) ports.push(p.PublicPort)
    }
  }
  return ports.sort((a, b) => a - b)
}

export async function getNextPort(): Promise<number> {
  const used = await getUsedPorts()
  let port = BASE_PORT
  while (used.includes(port)) port++
  return port
}

export async function createAgentContainer(opts: CreateAgentOptions) {
  const port = await getNextPort()
  const containerName = `agent-${opts.restaurantId}`
  const dataDir = `${process.cwd()}/restaurants/${opts.restaurantId}`

  // Ensure directories exist
  const fs = await import('fs/promises')
  await fs.mkdir(`${dataDir}/memory`, { recursive: true })
  await fs.mkdir(`${dataDir}/data`, { recursive: true })

  // Write restaurant config
  await fs.writeFile(
    `${dataDir}/config.json`,
    JSON.stringify(
      {
        restaurantId: opts.restaurantId,
        name: opts.name,
        type: opts.type,
        ownerName: opts.ownerName,
        ownerPhone: opts.ownerPhone,
        posProvider: opts.posProvider,
        posToken: opts.posToken || '',
        tier: opts.tier,
      },
      null,
      2
    )
  )

  // Write SOUL.md for this restaurant
  await fs.writeFile(
    `${dataDir}/SOUL.md`,
    `# ${opts.name} AI Assistant

You are the personal AI assistant for ${opts.name}, a ${opts.type} restaurant.

Owner: ${opts.ownerName}
Contact: ${opts.ownerPhone}

## Your Role
- Analyze daily sales data and provide actionable insights
- Identify trends, anomalies, and opportunities
- Send daily reports to the owner
- Suggest promotions and improvements

## Tone
- Friendly and professional
- Use specific numbers, not vague descriptions
- Keep messages concise (under 200 words)
- Speak in the owner's preferred language
`
  )

  try {
    // Remove existing container with same name if exists
    try {
      const existing = docker.getContainer(containerName)
      await existing.remove({ force: true })
    } catch {}

    const container = await docker.createContainer({
      Image: IMAGE,
      name: containerName,
      Cmd: ['tail', '-f', '/dev/null'], // Placeholder — replace with openclaw start
      Env: [
        `RESTAURANT_ID=${opts.restaurantId}`,
        `RESTAURANT_NAME=${opts.name}`,
        `OWNER_NAME=${opts.ownerName}`,
        `OWNER_PHONE=${opts.ownerPhone}`,
        `POS_PROVIDER=${opts.posProvider}`,
        `POS_TOKEN=${opts.posToken || ''}`,
        `TIER=${opts.tier}`,
      ],
      HostConfig: {
        PortBindings: {
          '3001/tcp': [{ HostPort: String(port) }],
        },
        Binds: [
          `${dataDir}:/data`,
          `${process.cwd()}/shared:/shared:ro`,
        ],
        RestartPolicy: { Name: 'unless-stopped' },
        Memory: 512 * 1024 * 1024, // 512MB
      },
    })

    await container.start()

    return {
      containerId: container.id,
      containerName,
      port,
    }
  } catch (error) {
    console.error('Failed to create container:', error)
    throw error
  }
}

export async function startContainer(containerId: string) {
  const container = docker.getContainer(containerId)
  await container.start()
}

export async function stopContainer(containerId: string) {
  const container = docker.getContainer(containerId)
  await container.stop()
}

export async function restartContainer(containerId: string) {
  const container = docker.getContainer(containerId)
  await container.restart()
}

export async function removeContainer(containerId: string) {
  const container = docker.getContainer(containerId)
  try {
    await container.stop()
  } catch {}
  await container.remove({ force: true })
}

export async function getContainerLogs(containerId: string, tail = 100) {
  const container = docker.getContainer(containerId)
  const logs = await container.logs({
    stdout: true,
    stderr: true,
    tail,
    follow: false,
  })
  return logs.toString()
}

export async function getContainerStatus(containerId: string) {
  try {
    const container = docker.getContainer(containerId)
    const info = await container.inspect()
    return {
      status: info.State.Status,
      running: info.State.Running,
      startedAt: info.State.StartedAt,
      finishedAt: info.State.FinishedAt,
      exitCode: info.State.ExitCode,
    }
  } catch {
    return { status: 'not_found', running: false, startedAt: null, finishedAt: null, exitCode: null }
  }
}

export async function listAgentContainers() {
  const containers = await docker.listContainers({ all: true })
  return containers
    .filter((c) => c.Names.some((n) => n.startsWith('/agent-')))
    .map((c) => ({
      id: c.Id,
      name: c.Names[0]?.replace('/', ''),
      status: c.State,
      ports: c.Ports,
      image: c.Image,
    }))
}
