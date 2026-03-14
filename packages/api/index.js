const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/agentscoinlaunchers')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, unique: true },
  telegramId: String,
  feeReceiver: String,
  createdAt: { type: Date, default: Date.now }
});

const TokenSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  supply: Number,
  creator: String,
  feeReceiver: String,
  transactionHash: String,
  createdAt: { type: Date, default: Date.now }
});

const TransactionSchema = new mongoose.Schema({
  type: String, // 'launch', 'swap', 'claim'
  wallet: String,
  amount: Number,
  fee: Number,
  token: String,
  createdAt: { type: Date, default: Date.now }
});

const SkillSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  author: String,
  config: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Token = mongoose.model('Token', TokenSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);
const Skill = mongoose.model('Skill', SkillSchema);

// Routes

// Register user
app.post('/api/users/register', async (req, res) => {
  try {
    const { walletAddress, telegramId, feeReceiver } = req.body;
    
    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = new User({ walletAddress, telegramId, feeReceiver });
      await user.save();
    } else {
      if (feeReceiver) user.feeReceiver = feeReceiver;
      if (telegramId) user.telegramId = telegramId;
      await user.save();
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Launch token
app.post('/api/tokens/launch', async (req, res) => {
  try {
    const { name, symbol, supply, creator, feeReceiver, transactionHash } = req.body;
    
    const token = new Token({
      name,
      symbol,
      supply,
      creator,
      feeReceiver,
      transactionHash
    });
    
    await token.save();
    
    // Record transaction
    const transaction = new Transaction({
      type: 'launch',
      wallet: creator,
      amount: 0.055,
      fee: 0.0165, // 30% of 0.055
      token: symbol,
      createdAt: new Date()
    });
    await transaction.save();
    
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user transactions
app.get('/api/transactions/:wallet', async (req, res) => {
  try {
    const transactions = await Transaction.find({ wallet: req.params.wallet })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Claim fees
app.post('/api/fees/claim', async (req, res) => {
  try {
    const { wallet, amount } = req.body;
    
    const transaction = new Transaction({
      type: 'claim',
      wallet,
      amount,
      fee: 0,
      token: 'SOL',
      createdAt: new Date()
    });
    
    await transaction.save();
    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
