import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env into process.env
dotenv.config();

// Check if DATABASE_URL environment variable is defined
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL variable is not defined in the .env file');
}

// Configure PostgreSQL connection pool using pg and NeonDB
const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection cannot be established
});

dbPool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
  process.exit(1); // Exit application if database connection encounters fatal error
});

export default dbPool;
