import { timingSafeEqual } from 'node:crypto';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createPickTheRobotMcpServer } from '@/lib/mcp/createPickTheRobotMcpServer';

/** Env var that enables Bearer-authenticated remote MCP on /api/mcp. */
export const MCP_HTTP_TOKEN_ENV = 'PICKTHEROBOT_MCP_HTTP_TOKEN';

function bearerMatches(authHeader: string, token: string): boolean {
  const expected = `Bearer ${token}`;
  const provided = authHeader.trim();
  if (provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

/**
 * Auth gate for remote MCP.
 * - Missing host token → 503 mcp_http_disabled (fail closed)
 * - Wrong/missing Authorization → 401
 * - Valid Bearer → null (allow)
 */
export function mcpHttpAuthFailure(request: Request): Response | null {
  const token = process.env[MCP_HTTP_TOKEN_ENV]?.trim();
  if (!token) {
    return Response.json(
      {
        error: 'mcp_http_disabled',
        message: `Remote MCP is disabled. Set ${MCP_HTTP_TOKEN_ENV} on the host (Vercel → Settings → Environment Variables), then redeploy. Or use the stdio server (see mcp-server/README.md).`,
      },
      { status: 503 },
    );
  }

  const auth = request.headers.get('authorization') ?? '';
  if (!bearerMatches(auth, token)) {
    return Response.json(
      {
        error: 'unauthorized',
        message: 'Missing or invalid Authorization: Bearer <token>.',
      },
      { status: 401 },
    );
  }

  return null;
}

/** Stateless Streamable HTTP handler (JSON responses — safer on Vercel serverless). */
export async function handleMcpHttpRequest(request: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  const server = createPickTheRobotMcpServer();
  await server.connect(transport);

  try {
    return await transport.handleRequest(request);
  } finally {
    await transport.close().catch(() => undefined);
    await server.close().catch(() => undefined);
  }
}
