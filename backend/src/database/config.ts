import knex from 'knex';
import path from 'path';

// Database file path
const dbPath = path.resolve(__dirname, '../../db/crypto_tracker.sqlite');

// Initialize knex with SQLite configuration
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true, // SQLite requires this
});

export default db; 