import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

const DB_FILE_PATH = 'n_data';

export const getDbConnection = async () => {
  const client = new PGlite(DB_FILE_PATH);
  return drizzle(client);
};

export const initializeTables = async () => {
  const db = await getDbConnection();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS collection_schemas (
      collection_name TEXT PRIMARY KEY,
      schema JSONB NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      collection_name TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `);
};

initializeTables();
