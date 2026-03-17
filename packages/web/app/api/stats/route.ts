import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

let cachedClient: MongoClient | null = null;

async function getMongoClient() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error('MongoDB URI not configured');
  }

  // Reuse cached connection
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

export async function GET() {
  try {
    const client = await getMongoClient();
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
    
    // Return demo data if MongoDB is unavailable (for local development)
    if (error instanceof Error && (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv'))) {
      console.log('⚠️ MongoDB unavailable - returning demo stats');
      return NextResponse.json({
        tokens: 3,
        totalVolume: 950000000000,
        users: 3,
        status: 'demo',
        message: 'Using demo data - MongoDB connection failed'
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch stats from database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 503 }
    );
  }
}
