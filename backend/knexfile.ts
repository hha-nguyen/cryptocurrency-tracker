import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'db/crypto_tracker.sqlite'),
    },
    migrations: {
      directory: path.resolve(__dirname, 'src/database/migrations'),
    },
    useNullAsDefault: true,
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'db/crypto_tracker.sqlite'),
    },
    migrations: {
      directory: path.resolve(__dirname, 'src/database/migrations'),
    },
    useNullAsDefault: true,
  },
};

export default config; 