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

    // Filter to only first 50 tokens and categorize by holder count
    const filteredTokens = tokens.slice(0, 50).map((token: any) => {
      // Determine status based on holder count
      const holders = token.holders || 0;
      let status = 'NEW_LAUNCH';
      
      if (holders >= 1000) {
        status = 'GRADUATED'; // Graduated: 1000+ holders
      } else if (holders >= 100) {
        status = 'PRE_GRAD'; // About to graduate: 100-999 holders
      } else {
        status = 'NEW_LAUNCH'; // New launches: < 100 holders
      }
      
      return {
        name: token.name || '',
        symbol: token.symbol || '',
        description: token.description || '',
        image: token.image || '',
        tokenMint: token.tokenMint || token.mint || '',
        status: status,
        holders: holders,
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
