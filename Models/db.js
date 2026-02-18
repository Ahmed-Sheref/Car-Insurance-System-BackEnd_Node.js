import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config(
{
    path: path.join(process.cwd(), 'MyProject', 'data.env') 
});

console.log('Attempting connection with user:', process.env.BASIC_USER);

const dbConfig = {
  user: process.env.BASIC_USER,
  password: process.env.BASIC_PASS,
  database: process.env.DB_DATABASE || 'Project2026',
  // Use DB_SERVER from env (in your data.env it's ".") or default to "."
  server: process.env.DB_SERVER || 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Only set an explicit port if DB_PORT is provided.
// If not, mssql will use SQL Browser / instance settings instead of forcing 1433.
if (process.env.DB_PORT) {
  dbConfig.port = Number(process.env.DB_PORT);
}

// Create a global pool object
export const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch((err) => {
    console.error('Database Connection Failed! Bad Config: ', err);
    throw err;
  });
