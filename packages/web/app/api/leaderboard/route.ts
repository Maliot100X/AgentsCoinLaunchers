import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

// Mock leaderboard data - no external API calls
const mockLeaderboard = [
  {
    wallet: 'Agent1Sol',
    name: 'Token Master',
    launchCount: 12,
    totalVolume: 450000000000,
    totalFees: 4500000000,
    totalEarnings: 3150000000,
    lastLaunchDate: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    tokens: [
      {
        name: 'Sample Token',
        symbol: 'SMPL',
        tokenMint: 'SampleTokenMint123',
        creatorWallet: 'Agent1Sol',
        creatorName: 'Token Master',
        volume: 50000000000,
        fees: 500000000,
        userShare: 350000000,
        launchDate: new Date().toISOString(),
        status: 'ACTIVE',
      },
    ],
  },
  {
    wallet: 'Agent2Luna',
    name: 'Coin Launcher',
    launchCount: 8,
    totalVolume: 300000000000,
    totalFees: 3000000000,
    totalEarnings: 2100000000,
    lastLaunchDate: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    tokens: [],
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get('sort') || 'earnings';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let leaderboard = [...mockLeaderboard];

    // Sort based on parameter
    if (sort === 'launches') {
      leaderboard.sort((a, b) => b.launchCount - a.launchCount);
    } else if (sort === 'recent') {
      leaderboard.sort((a, b) => new Date(b.lastLaunchDate).getTime() - new Date(a.lastLaunchDate).getTime());
    } else {
      // Default: sort by earnings
      leaderboard.sort((a, b) => b.totalEarnings - a.totalEarnings);
    }

    return NextResponse.json({
      leaderboard: leaderboard.slice(0, limit),
      total: leaderboard.length,
      status: 'ok',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data', details: String(error) },
      { status: 500 }
    );
  }
}
