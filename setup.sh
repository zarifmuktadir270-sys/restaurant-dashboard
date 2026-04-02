#!/bin/bash
set -e

echo "🤖 Restaurant Agent Dashboard Setup"
echo "===================================="

# Check dependencies
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Install it first:"
    echo "   curl -fsSL https://get.docker.com | sh"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    exit 1
fi

echo "✅ Docker found"

# Create required directories
mkdir -p restaurants shared

# Create shared templates if they don't exist
if [ ! -f shared/GUARDRAILS.md ]; then
    cat > shared/GUARDRAILS.md << 'EOF'
# Guardrails — All Agents Follow These

## NEVER:
- Share data between restaurants
- Make up numbers or statistics
- Post to social media without owner approval
- Give financial advice beyond restaurant operations
- Respond to messages outside business hours (unless urgent)

## ALWAYS:
- Verify data before reporting
- Include specific numbers, not vague descriptions
- Suggest one actionable item per report
- Ask before taking actions that cost money
- Keep responses under 200 words unless asked for detail
EOF
    echo "✅ Created shared/GUARDRAILS.md"
fi

if [ ! -f shared/ANALYST_SKILL.md ]; then
    cat > shared/ANALYST_SKILL.md << 'EOF'
# Analyst Skill

You analyze restaurant sales data and provide insights.

## Daily Routine
- 8:00 AM: Summarize yesterday's performance
- 12:00 PM: Check lunch rush trends
- 6:00 PM: Prepare evening summary
- 9:00 PM: End-of-day report with weekly comparison

## Report Format
1. Key number (total sales)
2. Comparison (vs last week/yesterday)
3. Top performer (best selling item)
4. One action item

## Example
"Yesterday: $2,840 (+12% vs last Tuesday). Burger combo #1 seller (47 units). Suggestion: Feature it on Instagram this week."
EOF
    echo "✅ Created shared/ANALYST_SKILL.md"
fi

if [ ! -f shared/WRITER_SKILL.md ]; then
    cat > shared/WRITER_SKILL.md << 'EOF'
# Writer Skill

You write clear, concise reports and messages for restaurant owners.

## Rules
- Keep it short (under 200 words)
- Use numbers, not adjectives ("$2,840" not "great sales")
- One insight per message
- End with a question or suggestion
- Use the owner's name when possible
EOF
    echo "✅ Created shared/WRITER_SKILL.md"
fi

# Build and start
echo ""
echo "🔨 Building dashboard..."
docker compose build

echo ""
echo "🚀 Starting services..."
docker compose up -d

echo ""
echo "⏳ Waiting for database..."
sleep 10

echo ""
echo "📊 Setting up database..."
docker compose exec dashboard npx prisma db push

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Dashboard: http://localhost:80"
echo "   (or http://YOUR-SERVER-IP:80 if on a VPS)"
echo ""
echo "📝 Next steps:"
echo "   1. Open the dashboard in your browser"
echo "   2. Add your first restaurant"
echo "   3. Connect a Telegram/WhatsApp channel"
echo ""
echo "Commands:"
echo "   docker compose ps          — check status"
echo "   docker compose logs -f     — view logs"
echo "   docker compose restart     — restart all"
echo "   docker compose down        — stop all"
