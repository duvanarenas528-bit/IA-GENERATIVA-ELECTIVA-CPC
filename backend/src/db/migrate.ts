import fs from 'fs';
import path from 'path';
import { pool } from './pool.js';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const migrationsDir = path.resolve(process.cwd(), 'src/db/migrations');
  const files = fs.readdirSync(migrationsDir).sort();
  for (const file of files) {
    if (file.endsWith('.sql')) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log('Running migration:', file);
      await pool.query(sql);
    }
  }
  console.log('Migrations done');
  await pool.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
