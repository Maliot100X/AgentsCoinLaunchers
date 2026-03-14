#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { validateConfig, CONFIG } from './config';
import { TOOL_DEFINITIONS } from './tools/definitions-new';
import { toolHandlers } from './tools/handlers-new';

// Validate configuration on startup
validateConfig();

// Create MCP server
const server = new Server(
  {
    name: 'bagsx-mcp',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// ==================== TOOL HANDLERS ====================

// List all available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.values(TOOL_DEFINITIONS),
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  console.error(`[BAGSX] Tool called: ${name}`);
  console.error(`[BAGSX] Arguments: ${JSON.stringify(args)}`);

  const handler = toolHandlers[name];
  if (!handler) {
    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      isError: true,
    };
  }

  try {
    const result = await handler(args || {});
    console.error(`[BAGSX] Result: SUCCESS`);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      isError: false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[BAGSX] Result: ERROR - ${message}`);
    return {
      content: [{ type: 'text', text: `Error: ${message}` }],
      isError: true,
    };
  }
});

// ==================== RESOURCE HANDLERS ====================

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'bags://platform/info',
        name: 'Platform Info',
        description: 'Bags.fm platform information and features',
        mimeType: 'application/json',
      },
    ],
  };
});

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'bags://platform/info': {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({
              platform: 'Bags.fm',
              description: 'Creator token launchpad on Solana',
              features: ['Token Launch', 'Trading', 'Fee Sharing', 'Creator Royalties'],
              apiDocs: 'https://docs.bags.fm',
              tools: Object.keys(TOOL_DEFINITIONS).length,
            }, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// ==================== SERVER STARTUP ====================

async function main() {
  console.error('[BAGSX] Starting MCP Server v2.0...');
  console.error(`[BAGSX] API Key: ${CONFIG.BAGS_API_KEY ? 'Configured ✓' : 'Not configured'}`);
  console.error(`[BAGSX] Tools: ${Object.keys(TOOL_DEFINITIONS).length} real API endpoints`);
  console.error('[BAGSX] Security: Unsigned transactions (zero custody)');

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('[BAGSX] Server running. Ready to accept connections.');
}

main().catch((error) => {
  console.error('[BAGSX] Fatal error:', error);
  process.exit(1);
});
