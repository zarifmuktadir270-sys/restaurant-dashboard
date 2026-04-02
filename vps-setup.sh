#!/bin/bash
set -e

echo "========================================="
echo "  Restaurant Agent Dashboard — VPS Setup"
echo "========================================="

# Check OS
if [ ! -f /etc/os-release ]; then
    echo "Error: Unsupported OS. Use Ubuntu 22.04+"
    exit 1
fi

# Install Node.js
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 22..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt install -y nodejs
fi
echo "Node.js: $(node --version)"

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi
echo "Docker: $(docker --version)"

# Install OpenClaw
if ! command -v openclaw &> /dev/null; then
    echo "Installing OpenClaw..."
    npm install -g openclaw
fi
echo "OpenClaw: installed"

# Navigate to dashboard directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing dashboard dependencies..."
npm install

# Generate Prisma client
echo "Generating database client..."
npx prisma generate

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "Installing PostgreSQL..."
    apt install -y postgresql postgresql-client
    systemctl enable postgresql
    systemctl start postgresql

    # Create database
    su - postgres -c "psql -c \"CREATE USER dashboard WITH PASSWORD 'dashboard123' CREATEDB;\""
    su - postgres -c "psql -c \"CREATE DATABASE dashboard OWNER dashboard;\""
fi

# Push database schema
echo "Setting up database..."
DATABASE_URL="postgresql://dashboard:dashboard123@localhost:5432/dashboard" npx prisma db push

# Create systemd service
cat > /etc/systemd/system/agent-dashboard.service << 'EOF'
[Unit]
Description=Restaurant Agent Dashboard
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/agent-dashboard
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=DATABASE_URL=postgresql://dashboard:dashboard123@localhost:5432/dashboard
Environment=PORT=80

[Install]
WantedBy=multi-user.target
EOF

# Build the app
echo "Building dashboard..."
DATABASE_URL="postgresql://dashboard:dashboard123@localhost:5432/dashboard" npm run build

# Copy to /opt
echo "Installing to /opt/agent-dashboard..."
cp -r "$(pwd)" /opt/agent-dashboard/

# Enable and start service
systemctl daemon-reload
systemctl enable agent-dashboard
systemctl start agent-dashboard

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "Dashboard: http://$(hostname -I | awk '{print $1}')"
echo ""
echo "Commands:"
echo "  systemctl status agent-dashboard   — check status"
echo "  systemctl restart agent-dashboard  — restart"
echo "  journalctl -u agent-dashboard -f   — view logs"
echo ""
echo "Next steps:"
echo "  1. Open the dashboard in your browser"
echo "  2. Add your first restaurant"
echo "  3. Configure API keys in Connection tab"
echo "  4. Click Start to launch agents"
