import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

import fs from 'fs';
import path from 'path';

let dbUrl = 'file:sqlite.db';

if (process.env.VERCEL) {
  const tmpDbPath = '/tmp/sqlite.db';
  if (!fs.existsSync(tmpDbPath)) {
    try {
      fs.copyFileSync(path.join(process.cwd(), 'sqlite.db'), tmpDbPath);
    } catch (e) {
      console.error('Failed to copy sqlite.db to /tmp', e);
    }
  }
  dbUrl = `file:${tmpDbPath}`;
}

const client = createClient({ url: dbUrl });
export const db = drizzle(client, { schema });
