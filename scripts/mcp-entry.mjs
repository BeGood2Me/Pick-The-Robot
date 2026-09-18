/**
 * Stdio MCP launcher — resolves repo root from this file so Grok/Cursor work even if cwd differs.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tsxCli = path.join(root, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const entry = path.join(root, 'mcp-server', 'src', 'index.ts');
const tsconfig = path.join(root, 'mcp-server', 'tsconfig.json');

const child = spawn(process.execPath, [tsxCli, '--tsconfig', tsconfig, entry], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
  windowsHide: true,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
