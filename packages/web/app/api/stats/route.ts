import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

export async function GET() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    return NextResponse.json(
      { error: 'MongoDB URI not configured' },
      { status: 503 }
    );
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('agentscoinlaunchers');

    // Get token count
    const tokenCount = await db.collection('tokens').countDocuments();

    // Get total volume from users collection
    const usersData: any = await db.collection('users').find({}).toArray();
    const totalVolume = usersData.reduce((sum: number, user: any) => sum + (user.totalVolume || 0), 0);

    // Get user count
    const userCount = await db.collection('users').countDocuments();

    return NextResponse.json({
      tokens: tokenCount,
      totalVolume: totalVolume,
      users: userCount,
      status: 'ok',
    });
  } catch (error) {
    console.error('MongoDB query failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats from database' },
      { status: 503 }
    );
  } finally {
    await client.close();
  }
}
