import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// API key tests must use the file store — never a developer's Neon database.
delete process.env.DATABASE_URL;
process.env.API_KEY_STORE_PATH = join(mkdtempSync(join(tmpdir(), 'ptr-api-keys-')), 'store.json');
process.env.VENDOR_STORE_PATH = join(mkdtempSync(join(tmpdir(), 'ptr-vendor-')), 'store.json');
