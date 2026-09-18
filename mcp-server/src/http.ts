import { createServer } from 'node:http';
import { createPickTheRobotMcpServer } from './createServer.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

const port = Number(process.env.PICKTHEROBOT_MCP_PORT ?? 3928);

const httpServer = createServer(async (req, res) => {
  const path = req.url?.split('?')[0] ?? '';
  if (path !== '/mcp') {
    res.statusCode = 404;
    res.end('Not Found');
    return;
  }

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  const mcp = createPickTheRobotMcpServer();
  await mcp.connect(transport);

  try {
    let parsedBody: unknown;
    if (req.method === 'POST') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(Buffer.from(chunk));
      }
      const raw = Buffer.concat(chunks).toString('utf8');
      parsedBody = raw ? JSON.parse(raw) : undefined;
    }

    await transport.handleRequest(req, res, parsedBody);
  } catch (error) {
    console.error('[picktherobot-mcp-http]', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  } finally {
    await transport.close();
    await mcp.close();
  }
});

httpServer.listen(port, () => {
  console.error(`[picktherobot-mcp] Streamable HTTP listening on http://127.0.0.1:${port}/mcp`);
  console.error(
    `[picktherobot-mcp] Grok: grok mcp add --transport http picktherobot http://127.0.0.1:${port}/mcp`,
  );
});
