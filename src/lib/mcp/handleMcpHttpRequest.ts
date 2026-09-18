import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createPickTheRobotMcpServer } from '../../../mcp-server/src/createServer';

/** Bearer token for remote MCP (Grok connectors, xAI API). Set in production env. */
export function mcpHttpAuthFailure(request: Request): Response | null {
  const token = process.env.PICKTHEROBOT_MCP_HTTP_TOKEN?.trim();
  if (!token) {
    return Response.json(
      {
        error: 'mcp_http_disabled',
        message:
          'Remote MCP is disabled. Clone the repo and use the stdio server (see mcp-server/README.md), or set PICKTHEROBOT_MCP_HTTP_TOKEN on the host.',
      },
      { status: 503 },
    );
  }

  const auth = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${token}`;
  if (auth !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  return null;
}

/** Stateless Streamable HTTP handler (one MCP server instance per request). */
export async function handleMcpHttpRequest(request: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  const server = createPickTheRobotMcpServer();
  await server.connect(transport);

  try {
    return await transport.handleRequest(request);
  } finally {
    await transport.close();
    await server.close();
  }
}
