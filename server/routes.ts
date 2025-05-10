import type { Express } from "express";
import { createServer, type Server } from "http";
import cors from 'cors';
import apiRoutes from './routes/api';
import { testConnection } from './db';

export async function registerRoutes(app: Express): Promise<Server> {
  // Testar conexão com o banco de dados
  await testConnection();
  
  // Configurar CORS
  app.use(cors());
  
  // Registrar rotas da API
  app.use('/api', apiRoutes);
  
  // Rota básica para verificar se o servidor está funcionando
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API funcionando' });
  });

  const httpServer = createServer(app);
  return httpServer;
}
