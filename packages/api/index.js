const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Import Bags tracker
const bagsTracker = require('./bags-tracker');

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// MIDDLEWARE
// ============================================================================
// Configure CORS to allow only specific origins
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://agentscoinlaunchers.vercel.app',
      'https://www.agentscoinlaunchers.vercel.app',
    ];
    
    // Allow requests with no origin (mobile apps, curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// ============================================================================
// MONGODB CONNECTION
// ============================================================================
const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/agentscoinlaunchers';

mongoose.connect(mongoUrl)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Running in demo mode (no database persistence)');
  });

// ============================================================================
// MONGOOSE SCHEMAS & MODELS
// ============================================================================

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, unique: true, sparse: true },
  telegramId: { type: String, unique: true, sparse: true },
  feeReceiver: String,
  balance: { type: Number, default: 0 },
  tokensCreated: { type: Number, default: 0 },
  feesEarned: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TokenSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  supply: Number,
  decimals: { type: Number, default: 9 },
  creator: String,
  creatorTelegram: String,
  feeReceiver: String,
  transactionHash: String,
  bagsMint: String,
  imageUrl: String,
  description: String,
  website: String,
  twitter: String,
  telegram: String,
  status: { type: String, default: 'pending' }, // pending, active, graduated, trending
  trendingScore: { type: Number, default: 0 },
  volume24h: { type: Number, default: 0 },
  trades24h: { type: Number, default: 0 },
  holders: { type: Number, default: 0 },
  liquidity: { type: Number, default: 0 },
  launchFee: { type: Number, default: 0.055 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TransactionSchema = new mongoose.Schema({
  type: String, // 'launch', 'swap', 'claim', 'fee_distribution'
  wallet: String,
  telegramId: String,
  amount: Number,
  fee: Number,
  token: String,
  tokenSymbol: String,
  transactionHash: String,
  status: { type: String, default: 'pending' }, // pending, confirmed, failed
  feeBreakdown: {
    userFee: Number,
    platformFee: Number,
    userPercent: Number,
    platformPercent: Number
  },
  createdAt: { type: Date, default: Date.now }
});

const SkillSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  author: String,
  code: String,
  documentation: String,
  usage: String,
  config: mongoose.Schema.Types.Mixed,
  downloads: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const WalletSchema = new mongoose.Schema({
  address: String,
  telegramId: String,
  balance: { type: Number, default: 0 },
  tokens: { type: Number, default: 0 },
  totalFeesEarned: { type: Number, default: 0 },
  claimedFees: { type: Number, default: 0 },
  unclaimedFees: { type: Number, default: 0 },
  transactionCount: { type: Number, default: 0 },
  isPrimary: Boolean,
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Token = mongoose.model('Token', TokenSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);
const Skill = mongoose.model('Skill', SkillSchema);
const Wallet = mongoose.model('Wallet', WalletSchema);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const calculateFees = (amount) => {
  const PLATFORM_PERCENT = 0.30;
  const USER_PERCENT = 0.70;
  return {
    total: amount,
    platformFee: parseFloat((amount * PLATFORM_PERCENT).toFixed(6)),
    userFee: parseFloat((amount * USER_PERCENT).toFixed(6)),
    platformPercent: (PLATFORM_PERCENT * 100) + '%',
    userPercent: (USER_PERCENT * 100) + '%'
  };
};

// ============================================================================
// DEMO DATA FALLBACK
// ============================================================================

const DEMO_STATS = {
  users: 42,
  tokens: 156,
  transactions: 1247,
  totalVolume: 450320.50
};

const DEMO_LEADERBOARD = [
  {
    rank: 1,
    id: 'agent_1',
    username: 'Luna_Crypto',
    telegramId: '123456789',
    wallet: '9B5X3D4z1QpZ2mL9xK7vN6tF5gH4jS2dW8cE3rU1aV',
    earnings: 12.5,
    launches: 23,
    joinedDate: new Date('2024-01-15')
  },
  {
    rank: 2,
    id: 'agent_2',
    username: 'Solana_Master',
    telegramId: '987654321',
    wallet: 'A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0',
    earnings: 10.2,
    launches: 18,
    joinedDate: new Date('2024-01-20')
  },
  {
    rank: 3,
    id: 'agent_3',
    username: 'Token_Trader',
    telegramId: '555666777',
    wallet: 'Z9Y8X7W6V5U4T3S2R1Q0P9O8N7M6L5K4J3I2H1G0',
    earnings: 8.75,
    launches: 15,
    joinedDate: new Date('2024-02-01')
  },
  {
    rank: 4,
    id: 'agent_4',
    username: 'DeFi_King',
    telegramId: '111222333',
    wallet: 'M1L2K3J4I5H6G7F8E9D0C1B2A3Z4Y5X6W7V8U9T0',
    earnings: 7.3,
    launches: 12,
    joinedDate: new Date('2024-02-05')
  },
  {
    rank: 5,
    id: 'agent_5',
    username: 'Bag_Hunter',
    telegramId: '444555666',
    wallet: 'T0U9V8W7X6Y5Z4A3B2C1D0E9F8G7H6I5J4K3L2M1',
    earnings: 6.1,
    launches: 10,
    joinedDate: new Date('2024-02-10')
  }
];

const DEMO_AGENT_PROFILES = {
  'agent_1': {
    id: 'agent_1',
    username: 'Luna_Crypto',
    telegramId: '123456789',
    wallet: '9B5X3D4z1QpZ2mL9xK7vN6tF5gH4jS2dW8cE3rU1aV',
    joinedDate: new Date('2024-01-15'),
    totalEarnings: 12.5,
    tokensLaunched: 23,
    tokens: [
      { id: 't1', name: 'Luna Token', symbol: 'LUNA', mint: 'LunaTokenMint123', launchedAt: new Date('2024-03-10'), supply: 1000000000, price: 0.00125, volume: 450.5 },
      { id: 't2', name: 'Moon Coin', symbol: 'MOON', mint: 'MoonTokenMint456', launchedAt: new Date('2024-03-08'), supply: 500000000, price: 0.000850, volume: 320.2 }
    ],
    recentTransactions: [
      { id: 'tx1', type: 'fee_claim', amount: 2.5, timestamp: new Date('2024-03-15'), status: 'confirmed' },
      { id: 'tx2', type: 'launch', amount: 0.055, timestamp: new Date('2024-03-14'), status: 'confirmed' }
    ],
    stats: {
      avgTokenSupply: 750000000,
      bestPerformer: 'LUNA',
      totalVolume: 12450.75
    }
  }
};

// ============================================================================
// USER ROUTES
// ============================================================================

/**
 * POST /api/users/register - Register or update user
 */
app.post('/api/users/register', async (req, res) => {
  try {
    const { walletAddress, telegramId, feeReceiver } = req.body;

    if (!walletAddress && !telegramId) {
      return res.status(400).json({ error: 'walletAddress or telegramId required' });
    }

    let user = await User.findOne({
      $or: [{ walletAddress }, { telegramId }]
    });

    if (!user) {
      user = new User({
        walletAddress,
        telegramId,
        feeReceiver: feeReceiver || walletAddress,
        status: 'active'
      });
      await user.save();
    } else {
      if (feeReceiver) user.feeReceiver = feeReceiver;
      if (walletAddress && !user.walletAddress) user.walletAddress = walletAddress;
      if (telegramId && !user.telegramId) user.telegramId = telegramId;
      user.updatedAt = new Date();
      await user.save();
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('❌ User registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/users/:identifier - Get user info
 */
app.get('/api/users/:identifier', async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [
        { walletAddress: req.params.identifier },
        { telegramId: req.params.identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/users/:identifier - Update user settings
 */
app.put('/api/users/:identifier', async (req, res) => {
  try {
    const { feeReceiver, status } = req.body;

    let user = await User.findOne({
      $or: [
        { walletAddress: req.params.identifier },
        { telegramId: req.params.identifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (feeReceiver) user.feeReceiver = feeReceiver;
    if (status) user.status = status;
    user.updatedAt = new Date();
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    console.error('❌ Update user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// TOKEN LAUNCH ROUTES
// ============================================================================

/**
 * POST /api/tokens/launch - Launch a new token
 */
app.post('/api/tokens/launch', async (req, res) => {
  try {
    const {
      name,
      symbol,
      supply,
      creator,
      creatorTelegram,
      feeReceiver,
      transactionHash,
      imageUrl,
      description,
      website,
      twitter,
      telegram
    } = req.body;

    // Validate required fields
    if (!name || !symbol || !supply || !creator) {
      return res.status(400).json({ error: 'Missing required fields: name, symbol, supply, creator' });
    }

    // Create token
    const token = new Token({
      name,
      symbol,
      supply: parseInt(supply),
      creator,
      creatorTelegram: creatorTelegram || '',
      feeReceiver: feeReceiver || creator,
      transactionHash,
      imageUrl: imageUrl || '',
      description: description || '',
      website: website || '',
      twitter: twitter || '',
      telegram: telegram || '',
      status: 'pending',
      launchFee: 0.055
    });

    await token.save();

    // Calculate fee split
    const LAUNCH_FEE = 0.055;
    const fees = calculateFees(LAUNCH_FEE);

    // Create platform transaction record
    const platformTransaction = new Transaction({
      type: 'fee_distribution',
      wallet: process.env.PLATFORM_WALLET_ADDRESS,
      amount: fees.platformFee,
      token: symbol,
      transactionHash,
      status: 'confirmed',
      feeBreakdown: {
        userFee: fees.userFee,
        platformFee: fees.platformFee,
        userPercent: 70,
        platformPercent: 30
      }
    });

    // Create user transaction record
    const userTransaction = new Transaction({
      type: 'launch',
      wallet: feeReceiver || creator,
      telegramId: creatorTelegram,
      amount: fees.userFee,
      token: symbol,
      transactionHash,
      status: 'confirmed',
      feeBreakdown: {
        userFee: fees.userFee,
        platformFee: fees.platformFee,
        userPercent: 70,
        platformPercent: 30
      }
    });

    await platformTransaction.save();
    await userTransaction.save();

    // Update user statistics
    if (creator) {
      await User.updateOne(
        {
          $or: [{ walletAddress: creator }, { telegramId: creatorTelegram }]
        },
        {
          $inc: {
            tokensCreated: 1,
            feesEarned: fees.userFee
          }
        },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      token,
      transaction: userTransaction,
      fees
    });
  } catch (error) {
    console.error('❌ Token launch error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/tokens - Get all tokens
 */
app.get('/api/tokens', async (req, res) => {
  try {
    const { status, sort = '-createdAt', limit = 50 } = req.query;

    // Validate sort parameter
    const validSortFields = ['createdAt', 'volume24h', 'holders', 'trendingScore'];
    const sortField = sort?.replace(/^-/, '') || 'createdAt';
    if (!validSortFields.includes(sortField)) {
      return res.status(400).json({ error: 'Invalid sort field' });
    }

    // Validate status parameter - only allow whitelisted values
    const validStatuses = ['NEW_LAUNCH', 'PRE_GRAD', 'GRADUATED'];
    let query = {};
    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      query.status = status;
    }

    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100); // Clamp between 1-100
    const tokens = await Token.find(query)
      .sort(sort)
      .limit(limitNum);

    res.json(tokens);
  } catch (error) {
    console.error('❌ Get tokens error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/tokens/:symbol - Get specific token
 */
app.get('/api/tokens/:symbol', async (req, res) => {
  try {
    const token = await Token.findOne({ symbol: req.params.symbol.toUpperCase() });

    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }

    res.json(token);
  } catch (error) {
    console.error('❌ Get token error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/tokens/:symbol/update-stats - Update token statistics
 */
app.put('/api/tokens/:symbol/update-stats', async (req, res) => {
  try {
    const { volume24h, trades24h, holders, liquidity, trendingScore } = req.body;

    const token = await Token.findOneAndUpdate(
      { symbol: req.params.symbol.toUpperCase() },
      {
        volume24h,
        trades24h,
        holders,
        liquidity,
        trendingScore,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }

    res.json({ success: true, token });
  } catch (error) {
    console.error('❌ Update token stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// WALLET ROUTES
// ============================================================================

/**
 * GET /api/wallet/:address - Get wallet information
 */
app.get('/api/wallet/:address', async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ address: req.params.address });

    if (!wallet) {
      return res.status(404).json({
        address: req.params.address,
        balance: '0 SOL',
        tokens: 0,
        feesEarned: '0 SOL',
        feeReceiverWallet: 'Not set',
        transactions: 0
      });
    }

    res.json({
      address: wallet.address,
      balance: `${wallet.balance} SOL`,
      tokens: wallet.tokens,
      feesEarned: `${wallet.totalFeesEarned} SOL`,
      unclaimedFees: `${wallet.unclaimedFees} SOL`,
      transactions: wallet.transactionCount,
      status: wallet.status
    });
  } catch (error) {
    console.error('❌ Get wallet error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/wallet/add - Add a new wallet
 */
app.post('/api/wallet/add', async (req, res) => {
  try {
    const { address, telegramId, isPrimary } = req.body;

    if (!address || !telegramId) {
      return res.status(400).json({ error: 'address and telegramId required' });
    }

    let wallet = new Wallet({
      address,
      telegramId,
      isPrimary: isPrimary || false,
      status: 'active'
    });

    await wallet.save();

    res.json({ success: true, wallet });
  } catch (error) {
    console.error('❌ Add wallet error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/wallet/:telegramId/all - Get all wallets for user
 */
app.get('/api/wallet/:telegramId/all', async (req, res) => {
  try {
    const wallets = await Wallet.find({ telegramId: req.params.telegramId });

    res.json(wallets);
  } catch (error) {
    console.error('❌ Get user wallets error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// TRANSACTION ROUTES
// ============================================================================

/**
 * GET /api/transactions/:wallet - Get wallet transactions
 */
app.get('/api/transactions/:wallet', async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { wallet: req.params.wallet },
        { telegramId: req.params.wallet }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(transactions);
  } catch (error) {
    console.error('❌ Get transactions error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/transactions/:wallet/stats - Get transaction statistics
 */
app.get('/api/transactions/:wallet/stats', async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { wallet: req.params.wallet },
        { telegramId: req.params.wallet }
      ]
    });

    const stats = {
      total: transactions.length,
      launches: transactions.filter(t => t.type === 'launch').length,
      swaps: transactions.filter(t => t.type === 'swap').length,
      claims: transactions.filter(t => t.type === 'claim').length,
      totalVolume: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      totalFees: transactions.reduce((sum, t) => sum + (t.fee || 0), 0)
    };

    res.json(stats);
  } catch (error) {
    console.error('❌ Get transaction stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// FEE MANAGEMENT ROUTES
// ============================================================================

/**
 * POST /api/fees/claim - Claim accumulated fees
 */
app.post('/api/fees/claim', async (req, res) => {
  try {
    const { wallet, telegramId, amount } = req.body;

    if (!wallet && !telegramId) {
      return res.status(400).json({ error: 'wallet or telegramId required' });
    }

    const transaction = new Transaction({
      type: 'claim',
      wallet,
      telegramId,
      amount,
      token: 'SOL',
      status: 'pending'
    });

    await transaction.save();

    // Update wallet
    if (wallet) {
      await Wallet.updateOne(
        { address: wallet },
        {
          $inc: {
            unclaimedFees: -amount,
            claimedFees: amount
          }
        }
      );
    }

    res.json({ success: true, transaction });
  } catch (error) {
    console.error('❌ Claim fees error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/fees/:wallet - Get unclaimed fees
 */
app.get('/api/fees/:wallet', async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { wallet: req.params.wallet },
        { telegramId: req.params.wallet }
      ],
      type: 'launch'
    });

    const totalFees = transactions.reduce((sum, t) => sum + (t.feeBreakdown?.userFee || 0), 0);

    res.json({
      wallet: req.params.wallet,
      totalFeesEarned: totalFees,
      launches: transactions.length
    });
  } catch (error) {
    console.error('❌ Get fees error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// UTILITY ROUTES

/**
 * GET /health - Health check
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * GET /api/stats - Platform statistics
 */
app.get('/api/stats', async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      tokens: await Token.countDocuments(),
      transactions: await Transaction.countDocuments(),
      totalVolume: (await Transaction.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]))[0]?.total || 0
    };

    res.json(stats);
  } catch (error) {
    console.error('❌ Get stats error:', error);
    console.log('⚠️  Using demo stats as fallback');
    // Return demo data on error
    res.json(DEMO_STATS);
  }
});

/**
 * GET /api/leaderboard - Get top agents by earnings and token launches with Bags.fm data
 */
app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'earnings'; // earnings, launches, recent

    let sortQuery = { totalEarnings: -1 };
    if (sort === 'launches') {
      sortQuery = { tokensLaunched: -1 };
    } else if (sort === 'recent') {
      sortQuery = { createdAt: -1 };
    }

    // Try to fetch real data from Bags.fm API
    let bagsData = {};
    let bagsIntegrationStatus = 'offline';
    
    try {
      // Fetch top token creators from Bags - using simple GET request
      // Example: https://api.bags.fm/api/v1/top-creators?limit=10
      const https = require('https');
      
      await new Promise((resolve, reject) => {
        https.get('https://api.bags.fm/api/v1/tokens?limit=' + Math.min(limit, 100), 
          {
            headers: {
              'User-Agent': 'AgentsCoinLaunchers/1.0',
              'Accept': 'application/json'
            },
            timeout: 8000
          },
          (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
              try {
                const bagsTokens = JSON.parse(data);
                // Map Bags data to creators
                if (bagsTokens.data && Array.isArray(bagsTokens.data)) {
                  bagsTokens.data.forEach(token => {
                    if (token.creator) {
                      if (!bagsData[token.creator]) {
                        bagsData[token.creator] = { tokensCreated: 0, totalVolume: 0 };
                      }
                      bagsData[token.creator].tokensCreated += 1;
                      bagsData[token.creator].totalVolume += (token.volume_24h || 0);
                    }
                  });
                }
                bagsIntegrationStatus = 'live';
                resolve();
              } catch (e) {
                reject(e);
              }
            });
          }
        ).on('error', reject);
      }).catch(err => {
        console.warn('⚠️  Bags.fm API call failed:', err.message);
        bagsIntegrationStatus = 'fallback';
      });
    } catch (bagsErr) {
      console.warn('⚠️  Could not fetch Bags.fm data:', bagsErr.message);
      bagsIntegrationStatus = 'fallback';
    }

    // Fetch from local database
    const agents = await User.find()
      .select('telegramUsername telegramId feeReceiverWallet totalEarnings tokensLaunched createdAt')
      .sort(sortQuery)
      .limit(limit)
      .lean();

    // Transform data for frontend with Bags enrichment
    const leaderboard = agents.map((agent, index) => {
      const bagsInfo = bagsData[agent.feeReceiverWallet] || {};
      return {
        rank: index + 1,
        id: agent._id.toString(),
        username: agent.telegramUsername || `User_${agent.telegramId}`,
        telegramId: agent.telegramId,
        wallet: agent.feeReceiverWallet,
        earnings: agent.totalEarnings || 0,
        launches: agent.tokensLaunched || 0,
        joinedDate: agent.createdAt,
        bagsCreated: bagsInfo.tokensCreated || 0,
        bagsVolume: bagsInfo.totalVolume || 0
      };
    });

    res.json({
      leaderboard,
      total: await User.countDocuments(),
      limit,
      sort,
      bagsIntegration: bagsIntegrationStatus
    });
  } catch (error) {
    console.error('❌ Get leaderboard error:', error);
    console.log('⚠️  Using demo leaderboard as fallback');
    // Return demo data on error
    res.json({
      leaderboard: DEMO_LEADERBOARD.slice(0, parseInt(req.query.limit) || 10),
      total: DEMO_LEADERBOARD.length,
      limit: parseInt(req.query.limit) || 10,
      sort: req.query.sort || 'earnings',
      demo: true
    });
  }
});

/**
 * GET /api/agents/:agentId - Get detailed agent profile
 */
app.get('/api/agents/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;

    // Check if it's a valid MongoDB ObjectId
    const isValidObjectId = agentId.match(/^[0-9a-fA-F]{24}$/);
    
    let agent;
    if (isValidObjectId) {
      agent = await User.findById(agentId);
    } else {
      // Try to find by telegramId
      agent = await User.findOne({ telegramId: parseInt(agentId) || agentId });
    }

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Get agent's tokens
    const tokens = await Token.find({ launchedBy: agent._id })
      .select('name symbol mint launchedAt totalSupply currentPrice volume holders')
      .sort({ launchedAt: -1 })
      .limit(20)
      .lean();

    // Get agent's recent transactions
    const transactions = await Transaction.find({ 
      $or: [
        { fromWallet: agent.feeReceiverWallet },
        { toWallet: agent.feeReceiverWallet }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const profile = {
      id: agent._id.toString(),
      username: agent.telegramUsername || `User_${agent.telegramId}`,
      telegramId: agent.telegramId,
      wallet: agent.feeReceiverWallet,
      joinedDate: agent.createdAt,
      totalEarnings: agent.totalEarnings || 0,
      tokensLaunched: agent.tokensLaunched || 0,
      tokens: tokens.map(token => ({
        id: token._id.toString(),
        name: token.name,
        symbol: token.symbol,
        mint: token.mint,
        launchedAt: token.launchedAt,
        supply: token.totalSupply,
        price: token.currentPrice || 0,
        volume: token.volume || 0,
        holders: token.holders || 0
      })),
      recentTransactions: transactions.map(tx => ({
        id: tx._id.toString(),
        type: tx.type,
        amount: tx.amount,
        fromWallet: tx.fromWallet,
        toWallet: tx.toWallet,
        timestamp: tx.createdAt
      }))
    };

    res.json(profile);
  } catch (error) {
    console.error('❌ Get agent profile error:', error);
    console.log('⚠️  Using demo agent profile as fallback');
    // Return demo data on error
    const demoProfile = DEMO_AGENT_PROFILES['agent_1'];
    if (demoProfile) {
      res.json({ ...demoProfile, demo: true });
    } else {
      res.status(404).json({ error: 'Agent not found', demo: true });
    }
  }
});

// ============================================================================
// UTILITY ROUTES
// ============================================================================


/**
 * GET /api/skills - Get all available skills
 */
app.get('/api/skills', async (req, res) => {
  try {
    const skillsDir = path.join(__dirname, '../../docs/skills');
    
    if (!fs.existsSync(skillsDir)) {
      return res.json({ skills: [], message: 'Skills directory not found' });
    }

    const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'));
    const skills = [];

    for (const file of files) {
      try {
        const filePath = path.join(skillsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Extract title and basic info from markdown
        const titleMatch = content.match(/^# (.+)$/m);
        const overviewMatch = content.match(/## Overview\s*\n([\s\S]*?)(?=##|$)/);
        const featuresMatch = content.match(/## Features\s*\n([\s\S]*?)(?=##|$)/);
        
        const skillId = file.replace('.md', '');
        const title = titleMatch ? titleMatch[1] : skillId;
        const overview = overviewMatch ? overviewMatch[1].trim().split('\n')[0] : 'No description available';
        const features = featuresMatch ? featuresMatch[1].split('\n').filter(l => l.trim().startsWith('- ')) : [];

        skills.push({
          id: skillId,
          name: title,
          description: overview,
          features: features.length,
          fileName: file,
          size: content.length
        });
      } catch (err) {
        console.error(`Error reading skill file ${file}:`, err);
      }
    }

    res.json({ skills, total: skills.length });
  } catch (error) {
    console.error('❌ Get skills error:', error);
    res.status(500).json({ error: 'Failed to retrieve skills', message: error.message });
  }
});

/**
 * GET /api/skills/:skillId - Get specific skill content
 */
app.get('/api/skills/:skillId', async (req, res) => {
  try {
    const { skillId } = req.params;
    
    // Security: Validate skillId to prevent path traversal attacks
    if (!/^[a-zA-Z0-9_-]+$/.test(skillId)) {
      return res.status(400).json({ error: 'Invalid skill ID format' });
    }
    
    const skillPath = path.join(__dirname, '../../docs/skills', `${skillId}.md`);
    const skillsDir = path.resolve(__dirname, '../../docs/skills');
    const resolvedPath = path.resolve(skillPath);
    
    // Ensure the resolved path is within the skills directory
    if (!resolvedPath.startsWith(skillsDir)) {
      return res.status(400).json({ error: 'Invalid skill path' });
    }
    
    if (!fs.existsSync(skillPath)) {
      return res.status(404).json({ error: `Skill '${skillId}' not found` });
    }

    const content = fs.readFileSync(skillPath, 'utf-8');
    
    // Parse markdown for structure
    const titleMatch = content.match(/^# (.+)$/m);
    const overviewMatch = content.match(/## Overview\s*\n([\s\S]*?)(?=##|$)/);
    
    res.json({
      id: skillId,
      name: titleMatch ? titleMatch[1] : skillId,
      content: content,
      overview: overviewMatch ? overviewMatch[1].trim() : '',
      mcp_ready: true
    });
  } catch (error) {
    console.error('❌ Get skill error:', error);
    res.status(500).json({ error: 'Failed to retrieve skill', message: error.message });
  }
});
// ============================================================================
// BAGS TRACKER ROUTES
// ============================================================================

/**
 * GET /api/bags/new - Get newly detected tokens
 */
app.get('/api/bags/new', bagsTracker.routes.getNewTokens);

/**
 * GET /api/bags/trending - Get trending tokens
 */
app.get('/api/bags/trending', bagsTracker.routes.getTrendingTokens);

/**
 * GET /api/bags/graduating - Get graduating tokens
 */
app.get('/api/bags/graduating', bagsTracker.routes.getGraduatingTokens);

/**
 * GET /api/bags/token/:mint - Get specific token data
 */
app.get('/api/bags/token/:mint', bagsTracker.routes.getTokenData);

/**
 * GET /api/bags/stats - Get system statistics
 */
app.get('/api/bags/stats', bagsTracker.routes.getStats);

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  
  // Don't leak stack traces or internal errors to clients
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorResponse = {
    error: 'Internal server error'
  };
  
  // Only include message in development
  if (isDevelopment) {
    errorResponse.message = err.message;
  }
  
  res.status(err.status || 500).json(errorResponse);
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 AgentsCoinLaunchers API Server Started');
  console.log('='.repeat(60));
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📊 Database: ${mongoUrl.includes('localhost') ? 'Local MongoDB' : 'Cloud MongoDB'}`);
  console.log(`🔐 CORS: Enabled`);
  console.log(`\n📚 Available Endpoints:`);
  console.log('\n🧑‍💼 *User Management:*');
  console.log('   POST   /api/users/register');
  console.log('   GET    /api/users/:identifier');
  console.log('   PUT    /api/users/:identifier');
  console.log('\n🚀 *Token Launch:*');
  console.log('   POST   /api/tokens/launch');
  console.log('   GET    /api/tokens');
  console.log('   GET    /api/tokens/:symbol');
  console.log('   PUT    /api/tokens/:symbol/update-stats');
  console.log('\n💼 *Wallet Management:*');
  console.log('   GET    /api/wallet/:address');
  console.log('   POST   /api/wallet/add');
  console.log('   GET    /api/wallet/:telegramId/all');
  console.log('\n📊 *Transactions & Fees:*');
  console.log('   GET    /api/transactions/:wallet');
  console.log('   GET    /api/transactions/:wallet/stats');
  console.log('   POST   /api/fees/claim');
  console.log('   GET    /api/fees/:wallet');
  console.log('\n🎯 *Bags.fm Real-Time Tracking:*');
  console.log('   GET    /api/bags/new');
  console.log('   GET    /api/bags/trending');
  console.log('   GET    /api/bags/graduating');
  console.log('   GET    /api/bags/token/:mint');
  console.log('   GET    /api/bags/stats');
  console.log('\n📚 *Skills:*');
  console.log('   GET    /api/skills');
  console.log('   POST   /api/skills');
  console.log('   GET    /api/skills/:id');
  console.log('\n⚙️ *Utilities:*');
  console.log('   GET    /health');
  console.log('   GET    /api/stats');
  console.log('\n🔗 Health Check: GET /health');
  console.log('='.repeat(60) + '\n');

  // Start Bags tracker system
  console.log('Starting Bags.fm Real-Time Token Tracker...\n');
  bagsTracker.start();
});

module.exports = app;
