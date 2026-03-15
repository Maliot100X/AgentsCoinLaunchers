#!/bin/bash
# Start all three services (API, Website, Bot)
# API on port 3001
# Website on port 3000 (or 3002 if 3000 is taken)
# Bot on stdin (terminal)

echo "=========================================="
echo "  AgentsCoinLaunchers - Full Stack Start"
echo "=========================================="
echo ""
echo "Starting all services..."
echo ""

# Start API in background
echo "1️⃣  Starting API on port 3001..."
cd packages/api
npm start > /tmp/api.log 2>&1 &
API_PID=$!
sleep 2
echo "   ✓ API PID: $API_PID"
echo ""

# Start Website in background
echo "2️⃣  Starting Website on port 3000..."
cd ../web
npm run dev > /tmp/web.log 2>&1 &
WEB_PID=$!
sleep 5
echo "   ✓ Website PID: $WEB_PID"
echo ""

# Start Bot in foreground
echo "3️⃣  Starting Telegram Bot..."
cd ../bot
echo "   (Press Ctrl+C to stop all services)"
echo ""
npm start

# Cleanup on exit
cleanup() {
  echo ""
  echo "Stopping all services..."
  kill $API_PID 2>/dev/null
  kill $WEB_PID 2>/dev/null
  echo "✓ All services stopped"
  exit 0
}

trap cleanup EXIT
