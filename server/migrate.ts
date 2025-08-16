import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL!;
const db = neon(connectionString);

export async function migrate() {
  await db`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await db`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      project_name VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      address TEXT,
      status VARCHAR(50) NOT NULL,
      project_images TEXT, -- <-- change ici
      sector VARCHAR(50) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      user_id INTEGER REFERENCES users(id)
    );
  `;
  await db`
    ALTER TABLE projects ALTER COLUMN project_images TYPE TEXT;
  `;
}
