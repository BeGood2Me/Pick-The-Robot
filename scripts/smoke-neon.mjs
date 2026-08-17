import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is required.');
  process.exit(1);
}

const sql = neon(url);
const rows = await sql`SELECT count(*)::int AS c FROM api_keys`;
console.log('Neon connected. api_keys rows:', rows[0].c);
