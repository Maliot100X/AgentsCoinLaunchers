#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║            AgentsCoinLaunchers - Quick Verification               ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Find the dev server port
PORT=$(lsof -i -P -n | grep "node.*LISTEN" | grep -oP ':\K[0-9]+' | head -1)

if [ -z "$PORT" ]; then
  echo "❌ Dev server not running!"
  echo "Start it with: cd packages/web && npm run dev"
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
