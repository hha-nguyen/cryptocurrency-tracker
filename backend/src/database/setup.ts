import path from 'path';
import fs from 'fs';
import db from './config';

/**
 * Ensure the database directory exists
 */
const ensureDatabaseDirectory = (): void => {
  const dbDir = path.resolve(__dirname, '../../db');
  
  if (!fs.existsSync(dbDir)) {
    console.log('Creating database directory');
    fs.mkdirSync(dbDir, { recursive: true });
  }
};

/**
 * Initialize the database
 */
export const initDatabase = async (): Promise<void> => {
  try {
    ensureDatabaseDirectory();
    
    // Test database connection
    await db.raw('SELECT 1');
    console.log('Database connection successful');
    
    // Additional setup can go here
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default initDatabase; 