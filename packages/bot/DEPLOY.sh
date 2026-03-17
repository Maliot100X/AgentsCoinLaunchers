#!/bin/bash
################################################################################
# AgentsCoinLaunchers Bot - Quick Deploy Script
# Run this to deploy the bot to your SSH/Linux server
################################################################################

set -e

REPO="https://github.com/Maliot100X/AgentsCoinLaunchers.git"
BOT_DIR="/opt/agentscoinlaunchers-bot"
BRANCH="master"

echo "🚀 AgentsCoinLaunchers Bot - Quick Deploy"
echo "========================================================================="
echo ""

# Check if running as root/sudo
if [ "$EUID" -ne 0 ]; then 
   echo "⚠️  Please run with sudo: sudo bash deploy.sh"
   exit 1
fi

echo "📥 Step 1: Checking prerequisites..."

# Install Node.js if needed
if ! command -v node &> /dev/null; then
    echo "  Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install PM2 if needed
if ! npm list -g pm2 &> /dev/null; then
    echo "  Installing PM2..."
    npm install -g pm2
fi

echo "✓ Prerequisites installed"
echo ""

echo "📁 Step 2: Setting up bot directory..."

# Stop existing bot if running
pm2 stop agentscoinlaunchers-bot 2>/dev/null || true
pm2 delete agentscoinlaunchers-bot 2>/dev/null || true

# Create/update bot directory
if [ ! -d "$BOT_DIR" ]; then
    mkdir -p "$BOT_DIR"
fi

cd "$BOT_DIR"

# Clone or update repo
if [ -d ".git" ]; then
    echo "  Updating existing repo..."
    git fetch origin
    git checkout $BRANCH
    git pull origin $BRANCH
else
    echo "  Cloning repository..."
    git clone -b $BRANCH "$REPO" .
fi

echo "✓ Repository ready"
echo ""

echo "📦 Step 3: Installing dependencies..."
cd "$BOT_DIR/packages/bot"
npm install
echo "✓ Dependencies installed"
echo ""

echo "⚙️  Step 4: Setting up configuration..."

if [ ! -f ".env" ]; then
    echo "  Creating .env from template..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env with your credentials:"
    echo "   nano $BOT_DIR/packages/bot/.env"
    echo ""
    echo "   Required values:"
    echo "   - TELEGRAM_BOT_TOKEN (from @BotFather)"
    echo "   - TELEGRAM_CHANNEL_ID (from @userinfobot)"
    echo "   - MONGODB_URI (from MongoDB Atlas)"
    echo "   - BAGS_API_KEY (from bags.fm)"
    echo "   - PLATFORM_WALLET_ADDRESS (your Solana wallet)"
    echo ""
    read -p "Press Enter after you've edited .env..."
fi

echo "✓ Configuration ready"
echo ""

echo "🧪 Step 5: Testing bot startup..."

# Test start (will timeout after 5 seconds)
timeout 5 npm start || true

echo ""
echo "✓ Bot test completed"
echo ""

echo "🚀 Step 6: Starting bot with PM2..."

pm2 start index.js --name "agentscoinlaunchers-bot" --watch
pm2 startup
pm2 save

echo "✓ Bot started with PM2"
echo ""

echo "========================================================================="
echo "✅ Deployment Complete!"
echo ""
echo "🎉 Bot is now running 24/7"
echo ""
echo "📊 Useful commands:"
echo "   pm2 status                         # Check bot status"
echo "   pm2 logs agentscoinlaunchers-bot   # View bot logs"
echo "   pm2 monit                          # Monitor in real-time"
echo "   pm2 restart agentscoinlaunchers-bot # Restart bot"
echo "   pm2 stop agentscoinlaunchers-bot    # Stop bot"
echo ""
echo "📁 Bot location: $BOT_DIR"
echo "📝 Config file: $BOT_DIR/packages/bot/.env"
echo ""
echo "🔗 Send /start to your bot in Telegram to test!"
echo "========================================================================="
