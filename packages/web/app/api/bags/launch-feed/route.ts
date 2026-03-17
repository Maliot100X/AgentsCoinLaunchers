import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const bagsApiKey = process.env.BAGS_API_KEY;
    
    if (!bagsApiKey) {
      return NextResponse.json(
        { error: 'BAGS_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://public-api-v2.bags.fm/api/v1/token-launch/feed', {
      method: 'GET',
      headers: {
        'x-api-key': bagsApiKey,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Bags API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch from Bags API' },
        { status: 500 }
      );
    }

    const data = await response.json();
    // Extract just the token array from Bags response
    // Bags returns: { success: true, response: [...tokens] }
    return NextResponse.json(data.response || []);
  } catch (error) {
    console.error('Error fetching Bags launch feed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
