import { handleMcpHttpRequest, mcpHttpAuthFailure } from '@/lib/mcp/handleMcpHttpRequest';

export const runtime = 'nodejs';

async function dispatch(request: Request) {
  const denied = mcpHttpAuthFailure(request);
  if (denied) return denied;
  return handleMcpHttpRequest(request);
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
