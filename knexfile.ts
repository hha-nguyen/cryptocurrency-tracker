import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Ensure database directory exists
const dbDir = path.resolve(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
  console.log('Creating database directory');
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.resolve(dbDir, 'crypto_tracker.sqlite');
console.log('Database path for migrations:', dbPath);

// Database configuration
const config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: dbPath,
    },
    migrations: {
      directory: path.resolve(__dirname, 'src/database/migrations'),
    },
    useNullAsDefault: true,
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: dbPath,
    },
    migrations: {
      directory: path.resolve(__dirname, 'src/database/migrations'),
    },
    useNullAsDefault: true,
  },
};

export default config; 