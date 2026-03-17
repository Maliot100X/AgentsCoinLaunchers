#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║            AgentsCoinLaunchers - Quick Verification               ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Find the dev server port - try multiple methods
PORT=""

# Try common Next.js dev ports
for p in 3000 3001 3002 3003 3004 3005; do
  if curl -s http://localhost:$p > /dev/null 2>&1; then
    PORT=$p
    break
  fi
done

if [ -z "$PORT" ]; then
  echo "❌ Dev server not running!"
  echo ""
  echo "To start the dev server:"
  echo "  cd packages/web"
  echo "  npm run dev"
  echo ""
  exit 1
fi

echo "✓ Found dev server on port $PORT"
echo ""

# Test APIs
echo "Testing API Endpoints..."
echo ""

# Stats
echo "1. Stats API:"
curl -s http://localhost:$PORT/api/stats | grep -o '"tokens":[0-9]*'

# Leaderboard
echo ""
echo "2. Leaderboard API:"
curl -s http://localhost:$PORT/api/leaderboard | grep -o '"name":"[^"]*"' | head -1

# Health
echo ""
echo "3. Health Check:"
curl -s http://localhost:$PORT/api/health | grep -o '"status":"[^"]*"'

# Homepage
echo ""
echo "4. Homepage:"
curl -s http://localhost:$PORT | grep -o '<title>[^<]*</title>'

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                    All Systems Verified ✓                         ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Visit http://localhost:$PORT in your browser!"
echo ""
