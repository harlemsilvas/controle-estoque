import sql from 'mssql';

const config: sql.config = {
  user: 'sa',
  password: 'xlaver',
  server: 'HARLEM-NOTE',
  database: 'HRM',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
  },
};

let pool: sql.ConnectionPool | null = null;

export async function connectToDatabase() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}
