import { config } from 'dotenv';
config();

export const CONFIG = {
  // Bags API Configuration
  BAGS_API_KEY: process.env.BAGS_API_KEY || '',
  BAGS_API_BASE_URL: 'https://public-api-v2.bags.fm/api/v1',

  // Solana Configuration (RPC only - no private keys)
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',

  // Rate limiting
  MAX_REQUESTS_PER_HOUR: 1000,

  // Defaults
  DEFAULT_SLIPPAGE: 1, // 1%
  DEFAULT_LIMIT: 10,
};

export function validateConfig(): void {
  if (!CONFIG.BAGS_API_KEY) {
    console.warn('Warning: BAGS_API_KEY not set. Some features will be limited.');
  }
}
