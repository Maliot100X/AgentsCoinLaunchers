import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    return NextResponse.json(
      { error: 'MongoDB URI not configured' },
      { status: 503 }
    );
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('agentscoinlaunchers');

    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get('sort') || 'earnings';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Fetch leaderboard from MongoDB
    let leaderboard = await db.collection('leaderboard').find({}).toArray();

    // If leaderboard is empty, build it from users and tokens
    if (leaderboard.length === 0) {
      const users = await db.collection('users').find({}).toArray();
      leaderboard = users.map((user) => ({
        wallet: user.walletAddress || user.name,
        name: user.name,
        launchCount: user.tokensCreated || 0,
        totalVolume: user.totalVolume || 0,
        totalFees: user.feesEarned || 0,
        totalEarnings: (user.feesEarned || 0) * 0.7, // 70% share
        lastLaunchDate: user.updatedAt || new Date().toISOString(),
        tokens: [],
      }));
    }

    // Sort based on parameter
    if (sort === 'launches') {
      leaderboard.sort((a, b) => (b.launchCount || 0) - (a.launchCount || 0));
    } else if (sort === 'recent') {
      leaderboard.sort((a, b) => new Date(b.lastLaunchDate).getTime() - new Date(a.lastLaunchDate).getTime());
    } else {
      // Default: sort by earnings
      leaderboard.sort((a, b) => (b.totalEarnings || 0) - (a.totalEarnings || 0));
    }

    return NextResponse.json({
      leaderboard: leaderboard.slice(0, limit),
      total: leaderboard.length,
      status: 'ok',
    });
  } catch (error) {
    console.error('MongoDB query failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard from database' },
      { status: 503 }
    );
  } finally {
    await client.close();
  }
}
