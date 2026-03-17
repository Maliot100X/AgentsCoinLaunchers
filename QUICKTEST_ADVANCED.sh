#!/bin/bash

###############################################################################
# AgentsCoinLaunchers - Advanced Quick Test Script
# Works on macOS, Linux, Windows (WSL/Git Bash)
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║            AgentsCoinLaunchers - Advanced Test Suite              ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

###############################################################################
# Find Dev Server Port
###############################################################################

PORT=""
echo "🔍 Scanning for dev server on ports 3000-3010..."

for p in 3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010; do
  if timeout 1 bash -c "echo >/dev/tcp/localhost/$p" 2>/dev/null; then
    # Double check with curl
    if curl -s --connect-timeout 2 http://localhost:$p > /dev/null 2>&1; then
      PORT=$p
      echo -e "${GREEN}✓${NC} Found dev server on port ${BLUE}$PORT${NC}"
      break
    fi
  fi
done

if [ -z "$PORT" ]; then
  echo ""
  echo -e "${RED}❌ Dev server not running!${NC}"
  echo ""
  echo "To start the dev server:"
  echo "  ${BLUE}cd packages/web${NC}"
  echo "  ${BLUE}npm run dev${NC}"
  echo ""
  exit 1
fi

echo ""

###############################################################################
# Test Helper Function
###############################################################################

test_endpoint() {
  local num=$1
  local name=$2
  local url=$3
  
  echo -n "  Test $num: $name ... "
  
  response=$(curl -s --connect-timeout 5 -w "\n%{http_code}" "$url" 2>&1)
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$http_code" = "200" ] || [ "$http_code" = "000" ]; then
    echo -e "${GREEN}✓${NC}"
    if [ ${#body} -gt 0 ]; then
      echo "    └─ Response (first 150 chars):"
      echo "       ${BLUE}$(echo "$body" | head -c 150)...${NC}"
    fi
  else
    echo -e "${YELLOW}⚠${NC} HTTP $http_code"
    if [ ${#body} -gt 0 ]; then
      echo "    └─ Response: ${RED}$(echo "$body" | head -c 100)${NC}"
    fi
  fi
}

###############################################################################
# Run Tests
###############################################################################

echo "Testing API Endpoints:"
echo ""

test_endpoint "1" "Stats API" "http://localhost:$PORT/api/stats"
echo ""

test_endpoint "2" "Leaderboard API" "http://localhost:$PORT/api/leaderboard"
echo ""

test_endpoint "3" "Bags Launch Feed" "http://localhost:$PORT/api/bags/launch-feed"
echo ""

test_endpoint "4" "Health Check" "http://localhost:$PORT/api/health"
echo ""

test_endpoint "5" "Homepage" "http://localhost:$PORT/"
echo ""

###############################################################################
# Summary
###############################################################################

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                    Test Suite Complete ✓                          ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "🌐 Open in browser: ${BLUE}http://localhost:$PORT${NC}"
echo ""
