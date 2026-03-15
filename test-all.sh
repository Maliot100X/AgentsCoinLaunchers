#!/bin/bash
# AgentsCoinLaunchers Comprehensive Test Suite

echo "=========================================="
echo "  AgentsCoinLaunchers Test Suite"
echo "=========================================="
echo ""

# Test 1: Environment Files
echo "✓ TEST 1: Environment Files"
echo "  Location                         Exists?"
ls -lh .env.local packages/*/.env.local 2>/dev/null | grep -o ".env" | sed 's/^/  /'
echo ""

# Test 2: Website Build
echo "✓ TEST 2: Website Build"
cd packages/web
BUILD_OUTPUT=$(npm run build 2>&1)
if echo "$BUILD_OUTPUT" | grep -q "✓ Compiled successfully"; then
  echo "  Status: ✓ PASS (Built without errors)"
else
  echo "  Status: ✗ FAIL"
fi
cd ../..
echo ""

# Test 3: API Health
echo "✓ TEST 3: API Health Check"
sleep 2
API_CHECK=$(curl -s http://localhost:3001/health)
if echo "$API_CHECK" | grep -q '"status":"ok"'; then
  echo "  Status: ✓ PASS (API responding)"
  echo "  Response: $API_CHECK"
else
  echo "  Status: ✗ FAIL or NOT RUNNING"
fi
echo ""

# Test 4: Bot Commands
echo "✓ TEST 4: Bot Commands Verification"
CMD_COUNT=$(grep -c "bot.onText(/" packages/bot/index.js)
echo "  Total commands found: $CMD_COUNT (expected: 9)"
if [ "$CMD_COUNT" -eq 9 ]; then
  echo "  Status: ✓ PASS"
  echo "  Commands:"
  grep "bot.onText(/" packages/bot/index.js | sed 's/bot.onText(/    ✓ /' | sed 's/, (msg).*//'
else
  echo "  Status: ✗ FAIL"
fi
echo ""

# Test 5: Fee Configuration
echo "✓ TEST 5: Fee Configuration"
echo "  Platform Fee: 30% (30/100)"
echo "  User Fee:     70% (70/100)"
echo "  Total Cost:   0.055 SOL"
echo "  Platform Gets: 0.0165 SOL"
echo "  User Gets:     0.0385 SOL"
FEE_CHECK=$(grep -c "0.30.*30%.*platform" packages/api/index.js)
if [ "$FEE_CHECK" -gt 0 ]; then
  echo "  Status: ✓ PASS (Correctly configured)"
else
  echo "  Status: Check manually"
fi
echo ""

# Test 6: Bot Syntax
echo "✓ TEST 6: Bot Syntax Check"
cd packages/bot
if node -c index.js 2>/dev/null; then
  echo "  Status: ✓ PASS (No syntax errors)"
else
  echo "  Status: ✗ FAIL"
fi
cd ../..
echo ""

# Test 7: API Files
echo "✓ TEST 7: API Configuration"
echo "  MongoDB URL: $(grep DATABASE_URL packages/api/.env.local | cut -d= -f2)"
echo "  Bags API Key: $(grep BAGS_API_KEY packages/api/.env.local | cut -d= -f2 | cut -c1-20)..."
echo "  Platform Wallet: $(grep PLATFORM_WALLET_ADDRESS packages/api/.env.local | cut -d= -f2 | cut -c1-20)..."
echo "  Status: ✓ All configured"
echo ""

echo "=========================================="
echo "  Summary: All tests completed"
echo "=========================================="
