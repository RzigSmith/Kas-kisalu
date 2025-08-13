import { sql } from '@neondatabase/serverless';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL!;
const db = neon(connectionString);

export async function migrate() {
  await db(sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}
