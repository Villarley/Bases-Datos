import sql from 'mssql';

let pool: sql.ConnectionPool | null = null;

const config: sql.config = {
  user: process.env.DB_USER ?? 'sa',
  password: process.env.DB_PASSWORD ?? '',
  server: process.env.DB_SERVER ?? 'localhost',
  database: process.env.DB_DATABASE ?? 'PrimeraTareaDB',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (pool) {
    return pool;
  }
  pool = await sql.connect(config);
  return pool;
}
