import { db } from "./db";

export async function migrateUsersTable() {
  // Utilise une requête SQL brute pour créer la table si elle n'existe pas
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'visitor',
      date_inscriptions TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
