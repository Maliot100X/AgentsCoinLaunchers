import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allVars = Object.keys(process.env)
    .sort()
    .map(key => {
      const value = process.env[key];
      const isSecret = value && value.length > 20 && (key.toUpperCase().includes('KEY') || key.toUpperCase().includes('TOKEN') || key.toUpperCase().includes('SECRET') || key.toUpperCase().includes('API'));
      return {
        key,
        value: isSecret ? value.substring(0, 10) + '...' + value.substring(value.length - 10) : value
      };
    });

  return NextResponse.json({
    totalVars: Object.keys(process.env).length,
    BAGS_API_KEY_EXISTS: !!process.env.BAGS_API_KEY,
    BAGS_API_KEY_VALUE: process.env.BAGS_API_KEY ? 'SET' : 'NOT SET',
    vars: allVars
  });
}
