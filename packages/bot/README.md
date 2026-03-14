# AgentsCoinLaunchers Telegram Bot

## Features

- `/start` - Register users
- `/help` - Show all commands
- `/launch` - Create tokens (0.055 SOL minimum)
- `/swap` - Token swaps
- `/wallet` - Check balance
- `/skills` - Browse skills
- `/claim` - Claim fees
- `/settings` - Configure
- `/history` - Transaction history

## Setup

1. Create `.env` file with `TELEGRAM_BOT_TOKEN=your_token`
2. Run: `npm install`
3. Start: `npm run dev`

## Deployment

Use PM2 for 24/7 uptime:

```bash
npm install -g pm2
pm2 start index.js --name "telegram-bot"
pm2 save
pm2 startup
```
