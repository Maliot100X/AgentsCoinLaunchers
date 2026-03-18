import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const revalidate = 0;

export async function GET() {
  try {
    const BAGS_KEY = 'bags_prod_YhTVMoennloNU06kSEDqQ8g_Bdd7_5g7RdcMT1EBr4o';

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

    // Filter to 50 tokens and categorize by age (since holders data isn't reliable from API)
    const now = Date.now();
    const filteredTokens = tokens.slice(0, 50).map((token: any, index: number) => {
      // Use token age for categorization since holders data is unreliable
      // Assume tokens are ordered by recency from Bags API
      let status = 'NEW_LAUNCH';
      
      // Categorize based on position in feed (newer = lower index)
      // New Launches: positions 0-15 (most recent)
      // About to Graduate: positions 16-32 (medium age)
      // Graduated: positions 33+ (older)
      if (index >= 33) {
        status = 'GRADUATED'; // Oldest tokens in feed
      } else if (index >= 16) {
        status = 'PRE_GRAD'; // Medium age tokens
      } else {
        status = 'NEW_LAUNCH'; // Most recent tokens
      }

      // Also use createdAt timestamp if available for better accuracy
      if (token.createdAt) {
        const tokenAge = now - new Date(token.createdAt).getTime();
        const hoursOld = tokenAge / (1000 * 60 * 60);
        
        // Refine status based on actual timestamp
        if (hoursOld > 48) {
          status = 'GRADUATED'; // Launched 48+ hours ago
        } else if (hoursOld > 24) {
          status = 'PRE_GRAD'; // Launched 24-48 hours ago
        } else {
          status = 'NEW_LAUNCH'; // Launched < 24 hours ago
        }
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
