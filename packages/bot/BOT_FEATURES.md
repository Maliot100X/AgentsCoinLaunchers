# 🤖 AgentsCoinLaunchers Telegram Bot - Complete Feature Documentation

## 📋 Table of Contents

1. User Commands
2. Features & Capabilities  
3. Database Schema
4. Error Handling
5. Examples & Workflows

---

## 👤 User Commands (10 Available)

### `/start` - Main Menu
**What it does:**
- Display main menu with 8 action buttons
- Create/retrieve user session
- Show platform branding

**Buttons available:**
- 🚀 Launch Token
- 🔄 Swap
- 💼 Wallet
- 📚 Skills  
- 💰 Claim Fees
- ⚙️ Settings
- 📜 History
- 🚀 Self Launch

**Response:**
```
🤖 AgentsCoinLaunchers Bot - Main Menu

[🚀 Launch Token] [🔄 Swap]
[💼 Wallet]      [📚 Skills]
[💰 Claim Fees]  [⚙️ Settings]
[📜 History]     [🚀 Self Launch]
[❓ Help]
```

---

### `/help` - Detailed Help
**What it does:**
- Show all available commands
- Explain each feature
- Provide tips and best practices
- Links to documentation

**Content:**
- Command list with descriptions
- Fee structure (70/30 split)
- How to get started
- Wallet requirements
- Links to Telegram channel

**Example output:**
```
📖 Available Commands:

🚀 /launch - Launch new token
💰 /claim - Claim earned fees
💼 /wallet - View wallet info
⚙️ /settings - Configure receiver
📜 /history - Transaction history
...
```

---

### `/launch` - Launch Token
**What it does:**
- Start token launch flow
- Collect token details
- Create SPL token on Solana
- Calculate and transfer fees

**Flow:**
1. User sends `/launch`
2. Bot asks for token name
3. Bot asks for symbol
4. Bot asks for supply
5. Bot asks for fee receiver wallet
6. Bot shows fee breakdown (70% user, 30% platform)
7. User confirms with transaction
8. Bot verifies on Solscan
9. Confirmation with token mint address

**Data collected:**
```javascript
{
  name: "MyToken",          // Token name
  symbol: "MYT",            // Token symbol
  supply: 1000000,          // Total supply
  creator: "walletAddress", // User's wallet
  feeReceiver: "walletAddr",// Fee destination
  transactionHash: "sig...", // Solana signature
  launchDate: timestamp,
  status: "completed"
}
```

**Fees calculated:**
- User pays: 0.055 SOL (creation fee)
- 70% of fees → User's fee receiver
- 30% of fees → Platform wallet

---

### `/wallet` - Wallet Information
**What it does:**
- Display wallet balance
- Show earned fees
- Display fee receiver wallet
- Show recent transactions

**Response shows:**
```
💼 Your Wallet

📊 Statistics:
- Wallet: 9oGPtMQk...
- Tokens Launched: 5
- Total Fees Earned: 2.34 SOL
- Fee Receiver: Dgk9bcm...

📜 Recent Launches:
1. MyToken (MYT) - 5 days ago
2. SecondToken (SEC) - 10 days ago
```

**Data displayed:**
- Primary wallet address
- Launch count
- Total fees earned
- Fee receiver address
- Recent transaction history

---

### `/settings` - Configure Settings
**What it does:**
- Set fee receiver wallet
- Update platform preferences
- Configure notification settings

**Options available:**
1. **Change Fee Receiver**
   - Enter new Solana wallet address
   - Verify address format
   - Update in database

2. **Notification Settings**
   - Enable/disable notifications
   - Choose notification types
   - Set frequency

3. **Privacy Settings**
   - Profile visibility
   - Transaction privacy
   - Data sharing

**Example:**
```
⚙️ Settings Menu

[Change Fee Receiver]
[Notification Preferences]
[Privacy Settings]
[Account Info]
[Reset Session]
```

---

### `/history` - Transaction History
**What it does:**
- Display all user transactions
- Show dates and amounts
- Link to Solscan for verification
- Filter by type (launch, claim, swap)

**Data shown:**
```
📜 Your Transaction History

Launches:
1. "MyToken" (MYT) - 5 days ago
   Fee: 0.50 SOL
   Signature: 5xjK3...
   
2. "SecondToken" (SEC) - 10 days ago
   Fee: 0.25 SOL
   Signature: 7Kx9m...

Claims:
1. 2.34 SOL claimed - 3 days ago
   Signature: 9pL4k...
```

**Filter options:**
- All transactions
- Launches only
- Claims only
- Swaps only
- Date range

---

### `/claim` - Claim Earned Fees
**What it does:**
- Display claimable fees
- Execute claim transaction
- Transfer fees to wallet
- Confirm transaction

**Flow:**
1. Show total earned fees
2. Show available to claim
3. User confirms claim
4. Transaction executes
5. Fee transferred to fee receiver wallet
6. Confirmation with hash

**Response:**
```
💰 Claim Fees

Available to Claim: 2.34 SOL

[✅ Claim Now] [❌ Cancel]

Transaction Hash: 5xjK3pL9m...
Status: Confirmed ✓
Amount: 2.34 SOL
Time: Just now
```

---

### `/swap` - Token Swap
**What it does:**
- Swap tokens on Solana
- Shows market rates
- Calculates slippage
- Executes swap transaction

**Features:**
- Quote token prices
- Set slippage tolerance
- Execute swaps
- Show transaction details

**Integration ready for:**
- Jupiter DEX
- Raydium
- Serum
- Other Solana DEXes

---

### `/selflaunch` - Direct Token Launch (Bags API)
**What it does:**
- Launch token directly via Bags API
- Bypass platform, direct Solana integration
- Lower fees (only Bags fees)
- Instant verification

**Flow:**
1. User sends `/selflaunch`
2. Bot collects token details
3. Call Bags API for launch
4. Verify on Solscan
5. Return token mint address

**Why use this:**
- Lower launch cost
- Direct Bags integration
- Instant deployment
- No platform intermediary

---

### `/skills` - AI Skills Showcase
**What it does:**
- Display available AI integrations
- Show skill descriptions
- Link to skill documentation
- Enable/disable per-user

**Available Skills:**
1. **Claude AI** - Advanced token analysis
2. **Claw Bot** - Trading signals
3. **Market Analysis** - Trend detection
4. **Risk Assessment** - Safety scoring
5. **Community Alerts** - Real-time signals

**Display format:**
```
📚 Available AI Skills

1. 🧠 Claude Analysis
   Advanced token fundamentals
   [Learn More] [Enable]

2. 📊 Claw Trading Signals  
   Real-time market signals
   [Learn More] [Enable]
```

---

## 🎯 Main Features

### 1️⃣ Token Launch System
**What happens:**
1. User initiates `/launch`
2. Collects token metadata (name, symbol, supply)
3. Validates inputs
4. Calculates fees (0.055 SOL base + 30% platform cut)
5. Creates SPL token on Solana
6. Verifies on Solscan
7. Stores in MongoDB
8. Distributes fees
9. Returns mint address

**Error handling:**
- Invalid wallet address → Error message
- Insufficient funds → Stop and explain
- Network failure → Retry with backoff
- Invalid token data → Request corrections

---

### 2️⃣ Fee Management
**Structure:**
```
Launch Fee Split:
├─ 70% → User's Fee Receiver Wallet
└─ 30% → Platform Wallet

Automatic Tracking:
├─ Per-user fee earnings
├─ Per-token fee amounts
├─ Claim history
└─ All stored in MongoDB
```

**Claiming fees:**
1. User clicks "Claim Fees"
2. Bot calculates total earned
3. Creates withdrawal transaction
4. Sends to configured fee receiver
5. Confirms on Solscan
6. Updates database

---

### 3️⃣ User Session Management
**Session Features:**
```javascript
Session includes:
- userId (Telegram ID)
- chatId
- username
- state (idle, launching, claiming, etc)
- walletAddress
- feeReceiverWallet
- sessionData (temp data during flows)
```

**States tracked:**
- `idle` - Main menu
- `launch_pending_payment` - Waiting for launch confirmation
- `launch_details` - Collecting launch data
- `settings_receiver` - Changing fee wallet
- `selflaunch_pending_key` - Awaiting API response

---

### 4️⃣ Database Integration (MongoDB)

**Collections:**

#### users
```javascript
{
  _id: ObjectId,
  telegramId: 1234567890,      // Unique Telegram ID
  walletAddress: "9oGPtMQk...",  // Solana wallet
  feeReceiverWallet: "Dgk9bcm...",
  totalFeesEarned: 2.34,         // In SOL
  totalVolumeTraded: 15.67,
  totalTokensLaunched: 5,
  createdAt: ISODate("2024-03-17"),
  lastActive: ISODate("2024-03-17"),
  isActive: true
}
```

#### tokens
```javascript
{
  _id: ObjectId,
  name: "MyToken",
  symbol: "MYT",
  supply: 1000000,
  decimals: 6,
  mint: "4zMMT...",              // Token mint address
  creator: "9oGPtMQk...",        // Creator wallet
  feeReceiver: "Dgk9bcm...",
  launchSignature: "5xjK3pL9m...",
  launchDate: ISODate("2024-03-17"),
  verified: true,
  status: "active"
}
```

#### transactions
```javascript
{
  _id: ObjectId,
  userWallet: "9oGPtMQk...",
  type: "launch",               // launch, claim, swap
  tokenMint: "4zMMT...",
  amount: 0.50,                 // Fee amount in SOL
  signature: "5xjK3pL9m...",
  status: "confirmed",
  timestamp: ISODate("2024-03-17"),
  verified: true,
  gasFee: 0.00025
}
```

---

### 5️⃣ Solana Integration
**Features:**
- ✅ SPL token creation
- ✅ Transaction verification (Solscan)
- ✅ Fee transfers
- ✅ Wallet validation
- ✅ Real-time status updates
- ✅ Signature verification

**RPC Endpoints used:**
```javascript
- Mainnet-beta: https://api.mainnet-beta.solana.com
- For verification: Solscan API
- Alternative: QuickNode RPC
```

---

### 6️⃣ Error Handling
**Recovery strategies:**
1. **Network errors** → Automatic retry (3 attempts)
2. **Invalid input** → User-friendly error message
3. **Wallet errors** → Validation before proceeding
4. **MongoDB errors** → Fallback to cached data
5. **Telegram API errors** → Log and continue
6. **Solana RPC errors** → Retry with different endpoint

**Error messages shown to users:**
```
❌ Invalid wallet address. Check format and try again.
❌ Insufficient balance. Need 0.055 SOL for launch fee.
⚠️ Network timeout. Retrying... (attempt 1/3)
❌ Token symbol already exists. Choose different name.
```

---

### 7️⃣ Webhook Integration (Optional)
**Ready for:**
- MongoDB Change Streams
- Telegram webhook mode (instead of polling)
- Solana transaction webhooks
- Price feed webhooks

---

### 8️⃣ Logging & Monitoring
**Tracked metrics:**
- Commands executed
- Users active
- Transactions pending
- Failed operations
- Response times
- Error rates

**Log levels:**
```javascript
console.log()    // Info
console.error()  // Errors  
console.warn()   // Warnings
```

---

## 📊 Data Flow

### Token Launch Flow:
```
User → /launch
  ↓
Collect token details
  ↓
Validate inputs
  ↓
Calculate fees
  ↓
Create SPL token (Solana RPC)
  ↓
Verify on Solscan
  ↓
Store in MongoDB
  ↓
Distribute fees
  ↓
Notify user with mint
  ↓
Update analytics
```

### Fee Claim Flow:
```
User → /claim
  ↓
Query earned fees from MongoDB
  ↓
Show available amount
  ↓
User confirms
  ↓
Execute claim transaction
  ↓
Verify on Solscan
  ↓
Update MongoDB
  ↓
Notify user
```

---

## 🔐 Security Measures

✅ **Input Validation**
- Wallet address format
- Token name length
- Supply limits
- Symbol format

✅ **Authentication**
- Telegram ID verification
- Wallet verification via Solscan
- Session management
- Transaction signature verification

✅ **Data Protection**
- Environment variables for secrets
- No passwords in logs
- Database connection pooling
- Rate limiting ready

✅ **Transaction Safety**
- Double-check before execution
- Signature verification
- Rollback capability
- Transaction history

---

## 💡 Usage Examples

### Example 1: Launch Token
```
User: /launch
Bot: What's the token name?
User: MyAwesomeToken
Bot: Token symbol?
User: MAT
Bot: Total supply?
User: 1000000
Bot: Fee receiver wallet?
User: 9oGPtMQk...

[Fee breakdown shown]

User: [Confirms transaction]
Bot: ✓ Token created!
     Mint: 4zMMT...
```

### Example 2: Claim Fees
```
User: /claim
Bot: You have 2.34 SOL to claim
     [✅ Claim] [❌ Cancel]
User: [Clicks Claim]
Bot: ✓ Claimed 2.34 SOL
     Hash: 5xjK3pL9m...
     Sent to: Dgk9bcm...
```

### Example 3: View History
```
User: /history
Bot: Your Transactions:
     
     Launches: 5
     1. MyToken - 5 days ago (0.50 SOL fee)
     2. MyToken2 - 10 days ago (0.25 SOL fee)
     
     Claims: 3
     1. 2.34 SOL - 3 days ago
```

---

## 🚀 Deployment Checklist

- [ ] Node.js 14+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] .env file configured with real credentials
- [ ] MongoDB Atlas account created
- [ ] Solana RPC endpoint verified
- [ ] Telegram bot token active
- [ ] Bags API key configured
- [ ] PM2 installed (`npm install -g pm2`)
- [ ] Bot starts successfully (`npm start`)
- [ ] All commands tested in Telegram
- [ ] PM2 startup configured (`pm2 startup`)
- [ ] Logs monitored (`pm2 logs`)

---

## 📈 Analytics & Stats

Bot automatically collects:
- Total users
- Total tokens launched  
- Total volume traded
- Total fees distributed
- Active users (per day)
- Command frequency
- Error rates
- Response times

Access via MongoDB or `/history` command.

---

**Bot is production-ready and fully documented! 🎉**

For setup, see: SETUP_INSTRUCTIONS.md
For deployment, use: DEPLOY.sh

