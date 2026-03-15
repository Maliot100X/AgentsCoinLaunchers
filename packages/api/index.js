const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Bags tracker
const bagsTracker = require('./bags-tracker');

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// MIDDLEWARE
// ============================================================================
app.use(cors());
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

    let query = {};
    if (status) query.status = status;

    const tokens = await Token.find(query)
      .sort(sort)
      .limit(parseInt(limit));

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
// SKILLS ROUTES
// ============================================================================

/**
 * GET /api/skills - Get all published skills
 */
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find({ published: true }).limit(50);

    res.json(skills);
  } catch (error) {
    console.error('❌ Get skills error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/skills - Create new skill
 */
app.post('/api/skills', async (req, res) => {
  try {
    const { name, description, category, author, code, documentation, usage } = req.body;

    const skill = new Skill({
      name,
      description,
      category,
      author,
      code,
      documentation,
      usage,
      published: false
    });

    await skill.save();

    res.json({ success: true, skill });
  } catch (error) {
    console.error('❌ Create skill error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/skills/:id - Get specific skill
 */
app.get('/api/skills/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.json(skill);
  } catch (error) {
    console.error('❌ Get skill error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// HEALTH & UTILITY ROUTES
// ============================================================================

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
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/leaderboard - Get top agents by earnings and token launches
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

    const agents = await User.find()
      .select('telegramUsername telegramId feeReceiverWallet totalEarnings tokensLaunched createdAt')
      .sort(sortQuery)
      .limit(limit)
      .lean();

    // Transform data for frontend
    const leaderboard = agents.map((agent, index) => ({
      rank: index + 1,
      id: agent._id.toString(),
      username: agent.telegramUsername || `User_${agent.telegramId}`,
      telegramId: agent.telegramId,
      wallet: agent.feeReceiverWallet,
      earnings: agent.totalEarnings || 0,
      launches: agent.tokensLaunched || 0,
      joinedDate: agent.createdAt
    }));

    res.json({
      leaderboard,
      total: await User.countDocuments(),
      limit,
      sort
    });
  } catch (error) {
    console.error('❌ Get leaderboard error:', error);
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
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
