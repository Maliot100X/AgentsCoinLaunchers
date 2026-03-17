import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allEnvVars = Object.keys(process.env)
    .filter(key => !key.includes('AWS') && !key.includes('VERCEL_URL'))
    .reduce((acc, key) => {
      acc[key] = process.env[key] ? '***SET***' : 'NOT SET';
      return acc;
    }, {} as Record<string, string>);

  return NextResponse.json({
    BAGS_API_KEY: process.env.BAGS_API_KEY ? 'EXISTS' : 'MISSING',
    allEnvVars
  });
}
