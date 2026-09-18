import { handleMcpHttpRequest, mcpHttpAuthFailure } from '@/lib/mcp/handleMcpHttpRequest';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function dispatch(request: Request) {
  const denied = mcpHttpAuthFailure(request);
  if (denied) return denied;
  return handleMcpHttpRequest(request);
}

/** CORS preflight for browser-based MCP clients (optional; most bots call server-side). */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET(request: Request) {
  return dispatch(request);
}

export async function POST(request: Request) {
  return dispatch(request);
}

export async function DELETE(request: Request) {
  return dispatch(request);
}
