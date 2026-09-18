import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createPickTheRobotMcpServer } from './createServer.js';

async function main() {
  const server = createPickTheRobotMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('[picktherobot-mcp]', error);
  process.exit(1);
});
