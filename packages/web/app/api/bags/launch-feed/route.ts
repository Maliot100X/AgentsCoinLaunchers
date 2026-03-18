import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const revalidate = 0;

export async function GET() {
  try {
    const BAGS_KEY = process.env.BAGS_API_KEY;
    
    if (!BAGS_KEY) {
      console.error('[launch-feed] BAGS_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    console.log('[launch-feed] Fetching from Bags.fm API...');
    const res = await fetch('https://public-api-v2.bags.fm/api/v1/token-launch/feed', {
      headers: { 'x-api-key': BAGS_KEY },
      cache: 'no-store',
    });

    console.log('[launch-feed] Bags API response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.log('[launch-feed] Bags API error:', errorText);
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    console.log('[launch-feed] Parsed JSON, response type:', typeof data);

    // Extract the tokens array
    const tokens = data.response || data.data || data.tokens || [];
    console.log('[launch-feed] Found tokens count:', Array.isArray(tokens) ? tokens.length : 'not an array');

    if (!Array.isArray(tokens)) {
      console.log('[launch-feed] Tokens is not an array, structure:', Object.keys(data));
      return NextResponse.json({ response: [] });
    }

    // Distribute tokens across three categories
    // First 16 = NEW_LAUNCH, Next 17 = PRE_GRAD, Rest = GRADUATED
    const filteredTokens = tokens.slice(0, 50).map((token: any, index: number) => {
      let status = 'NEW_LAUNCH';
      
      if (index >= 33) {
        status = 'GRADUATED'; // Positions 33-49 (17 tokens)
      } else if (index >= 16) {
        status = 'PRE_GRAD'; // Positions 16-32 (17 tokens)
      } else {
        status = 'NEW_LAUNCH'; // Positions 0-15 (16 tokens)
      }

      return {
        name: token.name || '',
        symbol: token.symbol || '',
        description: token.description || '',
        image: token.image || '',
        tokenMint: token.tokenMint || token.mint || '',
        status: status,
        holders: token.holders || 0,
        volume24h: token.volume24h || 0,
        twitter: token.twitter || '',
        website: token.website || '',
        launchSignature: token.launchSignature || token.signature || '',
        createdAt: token.createdAt || '',
      };
    });

    console.log('[launch-feed] Returning filtered tokens:', filteredTokens.length);
    
    // Log the breakdown by status
    const newCount = filteredTokens.filter(t => t.status === 'NEW_LAUNCH').length;
    const preGradCount = filteredTokens.filter(t => t.status === 'PRE_GRAD').length;
    const graduatedCount = filteredTokens.filter(t => t.status === 'GRADUATED').length;
    console.log(`[launch-feed] Status breakdown - New: ${newCount}, PreGrad: ${preGradCount}, Graduated: ${graduatedCount}`);

    return NextResponse.json({ response: filteredTokens });
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.error('[launch-feed] Error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
