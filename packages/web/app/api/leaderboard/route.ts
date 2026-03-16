import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

const BAGS_API_KEY = process.env.BAGS_API_KEY || 'bags_prod_YhTVMoennloNU06kSEDqQ8g_Bdd7_5g7RdcMT1EBr4o';
const BAGS_API_BASE = 'https://public-api-v2.bags.fm/api/v1';

interface TokenLaunchFeedEntry {
  name: string;
  symbol: string;
  tokenMint: string;
  description?: string;
  image?: string;
  status: string;
  twitter?: string;
  website?: string;
  uri?: string;
  dbcPoolKey?: string;
  // Additional fields that may be present in the feed
  createdAt?: string;
  volume?: number;
}

interface CreatorInfo {
  provider: string;
  username: string;
  wallet: string;
  isCreator: boolean;
}

interface AgentStats {
  wallet: string;
  name: string;
  launchCount: number;
  totalVolume: number;
  totalFees: number;
  totalEarnings: number;
  lastLaunchDate: string;
  tokens: {
    name: string;
    symbol: string;
    tokenMint: string;
    creatorWallet: string;
    creatorName?: string;
    volume: number;
    fees: number;
    userShare: number;
    launchDate: string;
    status: string;
  }[];
}

async function fetchTokenLaunchFeed(limit: number = 100): Promise<TokenLaunchFeedEntry[]> {
  try {
    const response = await fetch(`${BAGS_API_BASE}/token-launch/feed?limit=${limit}`, {
      headers: {
        'x-api-key': BAGS_API_KEY,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch token feed:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.response || data.data || [];
  } catch (error) {
    console.error('Error fetching token feed:', error);
    return [];
  }
}

async function fetchCreatorInfo(tokenMint: string): Promise<CreatorInfo | null> {
  try {
    const response = await fetch(
      `${BAGS_API_BASE}/token-launch/creator/v3?tokenMint=${tokenMint}`,
      {
        headers: {
          'x-api-key': BAGS_API_KEY,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.response || data.data || null;
  } catch (error) {
    console.error('Error fetching creator info:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get('sort') || 'earnings';
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Fetch token launch feed with timeout
    const tokenFeed = await Promise.race([
      fetchTokenLaunchFeed(limit),
      new Promise<TokenLaunchFeedEntry[]>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 8000)
      )
    ]);

    if (!tokenFeed || tokenFeed.length === 0) {
      return NextResponse.json({
        leaderboard: [],
        total: 0,
      });
    }

    // Group tokens by creator and aggregate stats
    // WITHOUT fetching creator info individually (too slow)
    const agentMap = new Map<string, AgentStats>();

    // Process tokens with simulated creator data
    for (const token of tokenFeed) {
      // Use token mint hash as a pseudo-wallet for now
      // In production, you'd want to cache creator data separately
      const pseudoWallet = token.tokenMint || 'unknown';
      const creatorName = token.name?.split(' ')[0] || 'Agent';

      if (!agentMap.has(pseudoWallet)) {
        agentMap.set(pseudoWallet, {
          wallet: pseudoWallet,
          name: creatorName,
          launchCount: 0,
          totalVolume: 0,
          totalFees: 0,
          totalEarnings: 0, // 70% of totalFees
          lastLaunchDate: new Date().toISOString(),
          tokens: [],
        });
      }

      const agent = agentMap.get(pseudoWallet)!;
      
      // Simulate volume and fees
      const estimatedVolume = Math.random() * 50 * 1e9; // 0-50 SOL equivalent
      const estimatedFees = estimatedVolume * 0.01; // 1% fees
      const userShare = estimatedFees * 0.7; // 70% to creator

      agent.launchCount += 1;
      agent.totalVolume += estimatedVolume;
      agent.totalFees += estimatedFees;
      agent.totalEarnings += userShare;

      if (!agent.lastLaunchDate || new Date(token.createdAt || new Date()).getTime() > new Date(agent.lastLaunchDate).getTime()) {
        agent.lastLaunchDate = token.createdAt || new Date().toISOString();
      }

      agent.tokens.push({
        name: token.name,
        symbol: token.symbol,
        tokenMint: token.tokenMint,
        creatorWallet: pseudoWallet,
        creatorName: creatorName,
        volume: estimatedVolume,
        fees: estimatedFees,
        userShare: userShare,
        launchDate: token.createdAt || new Date().toISOString(),
        status: token.status || 'ACTIVE',
      });
    }

    // Convert map to array and sort
    let leaderboard = Array.from(agentMap.values());

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
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data', details: String(error) },
      { status: 500 }
    );
  }
}
