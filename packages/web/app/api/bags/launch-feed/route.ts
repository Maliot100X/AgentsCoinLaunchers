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

    // Filter to only first 20 tokens and only needed fields (strip unnecessary bloat)
    const filteredTokens = tokens.slice(0, 20).map((token: any) => ({
      name: token.name || '',
      symbol: token.symbol || '',
      description: token.description || '',
      image: token.image || '',
      tokenMint: token.tokenMint || token.mint || '',
      status: token.status || 'LAUNCHED',
      twitter: token.twitter || '',
      website: token.website || '',
      launchSignature: token.launchSignature || token.signature || '',
    }));

    console.log('[launch-feed] Returning filtered tokens:', filteredTokens.length);

    return NextResponse.json({ response: filteredTokens });
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.error('[launch-feed] Error:', errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
