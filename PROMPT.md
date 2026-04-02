# Master Prompt: Restaurant AI Agent Dashboard

Use this prompt with any AI coding assistant (Claude, Cursor, ChatGPT, etc.) to build the full dashboard.

---

## The Project

Build a Next.js dashboard that manages multiple AI agent instances for restaurant owners. Each restaurant gets its own isolated AI agent that analyzes sales data, sends daily reports, and acts as a business advisor.

## Architecture

```
VPS (Ubuntu server)
├── Dashboard (Next.js, port 80) — this is what we're building
├── Docker Engine
│   ├── Container: OpenClaw #1 (Restaurant A, port 3001)
│   ├── Container: OpenClaw #2 (Restaurant B, port 3002)
│   ├── Container: OpenClaw #3 (Restaurant C, port 3003)
│   └── ...
├── PostgreSQL (stores dashboard data)
└── Redis (optional, for caching)
```

Each OpenClaw container:
- Runs one AI agent for one restaurant
- Has its own memory, config, and WhatsApp/Telegram connection
- Exposes an API at http://localhost:PORT for health, sessions, usage
- Is completely isolated from other restaurants

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API routes
- **Database:** PostgreSQL with Prisma ORM
- **Container Management:** Dockerode (Node.js Docker API client)
- **Auth:** NextAuth.js (email/password)
- **Charts:** Recharts
- **Real-time:** Server-Sent Events (SSE) for live status updates

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      String   @default("admin") // admin, operator
  createdAt DateTime @default(now())
}

model Restaurant {
  id          String   @id @default(cuid())
  name        String
  type        String   // pizza, burger, sushi, cafe, etc.
  ownerName   String
  ownerPhone  String
  ownerEmail  String?
  timezone    String   @default("UTC")
  posProvider String   // square, toast, clover, manual
  posToken    String?
  status      String   @default("active") // active, paused, stopped
  containerId String?  // Docker container ID
  containerName String? // Docker container name
  port        Int?     // Assigned port (3001, 3002, etc.)
  tier        String   @default("tier1") // tier1, tier2, tier3
  monthlyBudget Int    @default(5000) // in cents
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  agents      Agent[]
  costs       Cost[]
  activities  Activity[]
}

model Agent {
  id           String   @id @default(cuid())
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  name         String
  role         String   // ceo, analyst, writer, designer, social
  status       String   @default("idle") // idle, running, error, stopped
  lastActive   DateTime?
  totalTokens  Int      @default(0)
  totalCost    Float    @default(0) // in dollars
  createdAt    DateTime @default(now())
}

model Cost {
  id           String   @id @default(cuid())
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  date         DateTime
  modelUsed    String
  tokensIn     Int
  tokensOut    Int
  cost         Float // in dollars
  task         String?
}

model Activity {
  id           String   @id @default(cuid())
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  type         String   // insight, report, error, action
  message      String
  createdAt    DateTime @default(now())
}

model Config {
  id           String   @id @default(cuid())
  key          String   @unique
  value        String
  updatedAt    DateTime @updatedAt
}
```

## Pages & Features

### 1. Login Page (`/login`)
- Email + password auth
- Simple, clean design
- Redirect to dashboard on success

### 2. Dashboard Overview (`/`)
- Summary cards: Total Restaurants, Active Agents, Monthly Cost, Issues
- Recent activity feed (last 20 events across all restaurants)
- Cost chart (daily spend over last 30 days)
- Agent status grid (green/red dots for each restaurant's agent)

### 3. Restaurants List (`/restaurants`)
- Table/grid of all restaurants
- Columns: Name, Type, Status, Agent Status, Monthly Cost, Last Active
- Actions: View, Edit, Pause, Stop, Delete
- Search and filter by status/tier
- "Add Restaurant" button (opens modal)

### 4. Add Restaurant Modal (`/restaurants/new`)
- Form fields:
  - Restaurant name
  - Type (dropdown: Pizza, Burger, Sushi, Cafe, etc.)
  - Owner name, phone, email
  - Timezone
  - POS provider (Square, Toast, Clover, Manual)
  - POS API token (if applicable)
  - Tier (Tier 1: Advisor, Tier 2: Team, Tier 3: Full Suite)
  - Monthly budget
- On submit:
  1. Save to database
  2. Create Docker container for OpenClaw
  3. Configure the agent with restaurant data
  4. Start the container
  5. Link WhatsApp/Telegram
  6. Show success

### 5. Restaurant Detail (`/restaurants/[id]`)
- Restaurant info card (name, owner, POS, tier)
- Agent status panel (running/idle/error, uptime)
- Real-time logs viewer (last 100 lines)
- Cost breakdown (today, this week, this month)
- Activity timeline
- Quick actions:
  - Restart Agent
  - View Agent Memory
  - Edit Config
  - Send Test Message
  - View WhatsApp/Telegram Connection

### 6. Agent Memory Editor (`/restaurants/[id]/memory`)
- View and edit the agent's SOUL.md
- View and edit the agent's MEMORY.md
- View and edit restaurant-specific config
- Upload documents (menu, reports, etc.)

### 7. Cost Tracking (`/costs`)
- Overview: Total spend this month, projected spend
- Per-restaurant breakdown (table + chart)
- Daily spend trend (line chart)
- Token usage by model (pie chart)
- Export to CSV

### 8. Settings (`/settings`)
- Global config:
  - Default model (GPT-4o, Claude, etc.)
  - Default API keys
  - VPS connection settings
- Shared templates:
  - Edit GUARDRAILS.md (shared across all agents)
  - Edit ANALYST_SKILL.md
  - Edit WRITER_SKILL.md
- Notification settings (email alerts for errors, budget limits)

## API Routes

```
POST   /api/auth/login              - Login
POST   /api/auth/logout             - Logout

GET    /api/restaurants             - List all restaurants
POST   /api/restaurants             - Create new restaurant + container
GET    /api/restaurants/[id]        - Get restaurant details
PUT    /api/restaurants/[id]        - Update restaurant
DELETE /api/restaurants/[id]        - Delete restaurant + container

POST   /api/restaurants/[id]/start  - Start agent container
POST   /api/restaurants/[id]/stop   - Stop agent container
POST   /api/restaurants/[id]/restart - Restart agent container
GET    /api/restaurants/[id]/logs   - Get container logs (SSE stream)
GET    /api/restaurants/[id]/health - Check agent health

GET    /api/restaurants/[id]/memory - Get agent memory files
PUT    /api/restaurants/[id]/memory - Update agent memory files

GET    /api/restaurants/[id]/costs  - Get cost data
GET    /api/costs/overview          - Global cost overview

GET    /api/agents                  - List all agents
GET    /api/agents/[id]             - Get agent details

GET    /api/activity                - Recent activity feed
GET    /api/config                  - Get global config
PUT    /api/config                  - Update global config
```

## Docker Management

When creating a new restaurant:

```javascript
// Pseudo-code for container creation
const container = await docker.createContainer({
  Image: 'openclaw:latest',
  Name: `agent-${restaurantId}`,
  Env: [
    `RESTAURANT_ID=${restaurantId}`,
    `RESTAURANT_NAME=${name}`,
    `POS_TOKEN=${posToken}`,
    `WHATSAPP_SESSION=${restaurantId}`,
  ],
  HostConfig: {
    PortBindings: { '3001/tcp': [{ HostPort: String(assignedPort) }] },
    Binds: [
      `./restaurants/${restaurantId}:/data`,
      `./shared:/shared:ro`,
    ],
    RestartPolicy: { Name: 'unless-stopped' },
    Memory: 512 * 1024 * 1024, // 512MB limit
  },
});
await container.start();
```

## Shared Templates

The dashboard should manage shared prompt templates that all agents inherit:

```
/shared/
├── GUARDRAILS.md          - Rules all agents follow
├── ANALYST_SKILL.md       - How to analyze data
├── WRITER_SKILL.md        - How to write reports
├── DESIGNER_SKILL.md      - How to create images
├── RESPONSE_EXAMPLES.md   - Good vs bad responses
└── DAILY_ROUTINE.md       - What agents do each day
```

Each restaurant's agent gets:
- Shared templates (read-only, inherited)
- Restaurant-specific SOUL.md (editable per restaurant)
- Restaurant-specific MEMORY.md (agent writes to this)

## Styling

- Dark theme with warm brown/gold accents (coffee/restaurant vibe)
- Tailwind CSS for everything
- shadcn/ui components
- Responsive (works on mobile for checking status on the go)
- Font: Inter for body, Playfair Display for headings

## Deployment

The dashboard runs as a Docker container itself:

```yaml
# docker-compose.yml
services:
  dashboard:
    build: .
    ports:
      - "80:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/dashboard
      - DOCKER_HOST=unix:///var/run/docker.sock
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./restaurants:/app/restaurants
      - ./shared:/app/shared

  db:
    image: postgres:16
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=dashboard
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

## Important Notes

1. The dashboard needs access to Docker socket (`/var/run/docker.sock`) to manage containers
2. Each OpenClaw container uses ~200-400MB RAM
3. Port allocation should auto-increment (3001, 3002, 3003, etc.)
4. Container names follow pattern: `agent-{restaurant-slug}`
5. All restaurant data is stored in `./restaurants/{id}/` on the host
6. Shared templates go in `./shared/`
7. The dashboard itself should be lightweight (<100MB RAM)

## What NOT to Build (yet)

- Don't build billing/payment system
- Don't build multi-VPS support
- Don't build client-facing portal (restaurant owners don't see this dashboard)
- Don't build social media integration (Tier 2+ feature)
- Don't build weather-based automation (Tier 3 feature)

Focus on: Restaurant CRUD, agent management, cost tracking, logs.
