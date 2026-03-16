import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

export async function GET() {
  try {
    return NextResponse.json({
      tokens: 250,
      totalVolume: 5000000,
      users: 1250,
      status: 'ok',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
