import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso!');
    client.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados PostgreSQL:', error);
    return false;
  }
}

export async function query(text: string, params?: any[]) {
  try {
    const { rows } = await pool.query(text, params);
    return rows;
  } catch (error) {
    console.error('Erro ao executar consulta SQL:', error);
    throw error;
  }
}