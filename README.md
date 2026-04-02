# 🤖 Restaurant Agent Dashboard

A dashboard to manage AI agents for restaurant clients. Each restaurant gets its own isolated AI agent that analyzes sales data, sends daily reports, and acts as a business advisor.

## Quick Start

```bash
# Clone/copy this folder to your VPS
# Then run:
chmod +x setup.sh
./setup.sh
```

Open http://your-server-ip in your browser.

## What You Get

- **Dashboard** — Overview of all restaurants, costs, agent status
- **Restaurant Management** — Add/edit/delete restaurants with one click
- **Agent Control** — Start, stop, restart agents per restaurant
- **Cost Tracking** — See API spend per restaurant
- **Logs Viewer** — Real-time agent logs
- **Shared Templates** — Edit agent prompts that apply to all restaurants

## Architecture

```
VPS
├── Dashboard (this project, port 80)
├── PostgreSQL (stores data)
├── Docker
│   ├── Agent Container 1 (Restaurant A, port 3001)
│   ├── Agent Container 2 (Restaurant B, port 3002)
│   └── ...
└── Shared Templates (inherited by all agents)
```

## Files

```
├── setup.sh                    ← Run this first
├── docker-compose.yml          ← Docker config
├── Dockerfile                  ← Dashboard container
├── package.json                ← Dependencies
├── prisma/
│   └── schema.prisma           ← Database schema
├── src/
│   ├── app/
│   │   ├── page.tsx            ← Dashboard overview
│   │   ├── restaurants/        ← Restaurant pages
│   │   ├── costs/              ← Cost tracking
│   │   ├── settings/           ← Settings page
│   │   └── api/                ← API routes
│   ├── lib/
│   │   ├── db.ts               ← Database client
│   │   └── docker.ts           ← Docker management
│   └── components/             ← UI components
├── shared/                     ← Shared agent templates
│   ├── GUARDRAILS.md
│   ├── ANALYST_SKILL.md
│   └── WRITER_SKILL.md
└── restaurants/                ← Per-restaurant data (auto-created)
```

## Commands

```bash
docker compose up -d          # Start everything
docker compose down           # Stop everything
docker compose logs -f        # View logs
docker compose ps             # Check status
docker compose restart        # Restart

# Database
docker compose exec dashboard npx prisma studio  # Browse data
docker compose exec dashboard npx prisma db push  # Update schema
