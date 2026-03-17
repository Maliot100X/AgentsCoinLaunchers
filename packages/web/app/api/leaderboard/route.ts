import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

let cachedClient: MongoClient | null = null;

async function getMongoClient() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error('MongoDB URI not configured');
  }

  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

export async function GET(request: NextRequest) {
  try {
    const client = await getMongoClient();
    const db = client.db('agentscoinlaunchers');

    // Get sort parameter
    const searchParams = request.nextUrl.searchParams;
    const sortBy = searchParams.get('sortBy') || 'totalEarnings';
    const limit = parseInt(searchParams.get('limit') || '100');

    // Get leaderboard from collection
    let leaderboard: any = await db.collection('leaderboard').find({}).toArray();

    // If leaderboard is empty, build it from users and tokens
    if (leaderboard.length === 0) {
      const users: any = await db.collection('users').find({}).toArray();
      const allTokens: any = await db.collection('tokens').find({}).toArray();
      const allTransactions: any = await db.collection('transactions').find({}).toArray();

      leaderboard = users.map((user: any) => {
        // Get tokens launched by this user
        const userTokens = allTokens.filter((token: any) => token.creatorWallet === (user.walletAddress || user.name));
        
        // Get transactions for this user's tokens
        const userTransactions = allTransactions.filter((tx: any) => 
          userTokens.some((token: any) => token.tokenMint === tx.tokenMint)
        );

        return {
          wallet: user.walletAddress || user.name,
          name: user.name,
          launchCount: user.tokensCreated || 0,
          totalVolume: user.totalVolume || 0,
          totalFees: user.feesEarned || 0,
          totalEarnings: (user.feesEarned || 0) * 0.7, // 70% share
          lastLaunchDate: user.updatedAt || new Date().toISOString(),
          tokens: userTokens,
          transactions: userTransactions,
        };
      });
    } else {
      // If leaderboard exists, fetch and attach real tokens and transactions
      const allTokens: any = await db.collection('tokens').find({}).toArray();
      const allTransactions: any = await db.collection('transactions').find({}).toArray();

      leaderboard = leaderboard.map((entry: any) => {
        // Get tokens launched by this wallet
        const userTokens = allTokens.filter((token: any) => token.creatorWallet === entry.wallet);
        
        // Get transactions for this user's tokens
        const userTransactions = allTransactions.filter((tx: any) => 
          userTokens.some((token: any) => token.tokenMint === tx.tokenMint)
        );

        return {
          ...entry,
          tokens: userTokens,
          transactions: userTransactions,
        };
      });
    }

    // Sort based on parameter
    if (sortBy === 'launchCount') {
      leaderboard.sort((a: any, b: any) => b.launchCount - a.launchCount);
    } else {
      leaderboard.sort((a: any, b: any) => b.totalEarnings - a.totalEarnings);
    }

    // Apply limit
    leaderboard = leaderboard.slice(0, limit);

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    
    // Return demo data if MongoDB is unavailable
    if (error instanceof Error && (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv'))) {
      console.log('⚠️ MongoDB unavailable - returning demo leaderboard');
      return NextResponse.json({
        leaderboard: [
          {
            wallet: '8xAk3GsS5kXvvYBmkEaXWfxR5fqNUh6GbEL2zYnDwXXX',
            name: 'Agent Alpha',
            launchCount: 12,
            totalVolume: 450000000000,
            totalFees: 250000000000,
            totalEarnings: 175000000000,
            lastLaunchDate: new Date().toISOString(),
            tokens: [
              {
                _id: 'token1',
                name: 'Demo Token 1',
                symbol: 'DEMO1',
                tokenMint: '8xAk3GsS5kXvvYBmkEaXWfxR5fqNUh6GbEL2zYnDwXXX',
                creatorWallet: '8xAk3GsS5kXvvYBmkEaXWfxR5fqNUh6GbEL2zYnDwXXX',
                supply: 1000000000,
                price: 0.0001,
                volume: 150000000000,
                holders: 1250,
                fees: 50000000,
                status: 'active',
                launchDate: new Date().toISOString(),
              }
            ],
            transactions: []
          },
          {
            wallet: '7yBj2FrH4jWvvZCnlFbYVgsQ4gqMiG5FdF3zXoEexYYY',
            name: 'Agent Beta',
            launchCount: 8,
            totalVolume: 320000000000,
            totalFees: 180000000000,
            totalEarnings: 126000000000,
            lastLaunchDate: new Date().toISOString(),
            tokens: [],
            transactions: []
          },
          {
            wallet: '6zCi1EqG3iUuuYDmkGcXUhsR3hpLjF4EcE2yWpFfvZZZ',
            name: 'Agent Gamma',
            launchCount: 5,
            totalVolume: 180000000000,
            totalFees: 100000000000,
            totalEarnings: 70000000000,
            lastLaunchDate: new Date().toISOString(),
            tokens: [],
            transactions: []
          }
        ]
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 503 }
    );
  }
}
