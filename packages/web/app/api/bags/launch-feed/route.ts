import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  try {
    const BAGS_KEY = 'bags_prod_YhTVMoennloNU06kSEDqQ8g_Bdd7_5g7RdcMT1EBr4o';

    const res = await fetch('https://public-api-v2.bags.fm/api/v1/token-launch/feed', {
      headers: { 'x-api-key': BAGS_KEY },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return NextResponse.json(await res.json());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
