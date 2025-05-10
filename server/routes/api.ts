import express from 'express';
import type { Request, Response } from 'express';
import { query, db } from '../db';
import { products, clients, quotes, insertProductSchema, insertClientSchema, insertQuoteSchema } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Produtos
router.get('/produtos', async (req: Request, res: Response) => {
  try {
    const produtos = await db.select().from(products);
    res.json(produtos);
  } catch (error: any) {
    console.error('Erro ao obter produtos:', error);
    res.status(500).json({ message: 'Erro ao obter produtos', error: error.message });
  }
});

router.get('/produtos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [produto] = await db.select().from(products).where(eq(products.id, parseInt(id)));
    
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    res.json(produto);
  } catch (error: any) {
    console.error('Erro ao obter produto:', error);
    res.status(500).json({ message: 'Erro ao obter produto', error: error.message });
  }
});

router.post('/produtos', async (req: Request, res: Response) => {
  try {
    const parsed = insertProductSchema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({ message: 'Dados de produto inválidos', errors: parsed.error.errors });
    }
    
    const [produto] = await db.insert(products).values(parsed.data).returning();
    
    res.status(201).json(produto);
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
  }
});

router.put('/produtos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = insertProductSchema.partial().safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({ message: 'Dados de produto inválidos', errors: parsed.error.errors });
    }
    
    // Verificar se o produto existe
    const [produto] = await db.select().from(products).where(eq(products.id, parseInt(id)));
    
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    // Atualizar o produto
    const [updatedProduto] = await db
      .update(products)
      .set(parsed.data)
      .where(eq(products.id, parseInt(id)))
      .returning();
    
    res.json(updatedProduto);
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
  }
});

router.delete('/produtos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se o produto existe
    const [produto] = await db.select().from(products).where(eq(products.id, parseInt(id)));
    
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    // Em uma implementação real, verificaríamos se o produto está sendo usado em algum orçamento
    
    // Excluir o produto
    await db.delete(products).where(eq(products.id, parseInt(id)));
    
    res.json({ message: 'Produto excluído com sucesso' });
  } catch (error: any) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ message: 'Erro ao excluir produto', error: error.message });
  }
});

// Clientes
router.get('/clientes', async (req: Request, res: Response) => {
  try {
    const clientes = await db.select().from(clients);
    res.json(clientes);
  } catch (error: any) {
    console.error('Erro ao obter clientes:', error);
    res.status(500).json({ message: 'Erro ao obter clientes', error: error.message });
  }
});

router.get('/clientes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [cliente] = await db.select().from(clients).where(eq(clients.id, parseInt(id)));
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    res.json(cliente);
  } catch (error: any) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).json({ message: 'Erro ao obter cliente', error: error.message });
  }
});

router.post('/clientes', async (req: Request, res: Response) => {
  try {
    const parsed = insertClientSchema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({ message: 'Dados de cliente inválidos', errors: parsed.error.errors });
    }
    
    const [cliente] = await db.insert(clients).values(parsed.data).returning();
    
    res.status(201).json(cliente);
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
  }
});

router.put('/clientes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = insertClientSchema.partial().safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({ message: 'Dados de cliente inválidos', errors: parsed.error.errors });
    }
    
    // Verificar se o cliente existe
    const [cliente] = await db.select().from(clients).where(eq(clients.id, parseInt(id)));
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    // Atualizar o cliente
    const [updatedCliente] = await db
      .update(clients)
      .set(parsed.data)
      .where(eq(clients.id, parseInt(id)))
      .returning();
    
    res.json(updatedCliente);
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
  }
});

router.delete('/clientes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se o cliente existe
    const [cliente] = await db.select().from(clients).where(eq(clients.id, parseInt(id)));
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    // Em uma implementação real, verificaríamos se o cliente está sendo usado em algum orçamento
    
    // Excluir o cliente
    await db.delete(clients).where(eq(clients.id, parseInt(id)));
    
    res.json({ message: 'Cliente excluído com sucesso' });
  } catch (error: any) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ message: 'Erro ao excluir cliente', error: error.message });
  }
});

// Orçamentos - implementação simplificada para início
router.get('/orcamentos', async (req: Request, res: Response) => {
  try {
    const orcamentos = await db.select().from(quotes);
    res.json(orcamentos);
  } catch (error: any) {
    console.error('Erro ao obter orçamentos:', error);
    res.status(500).json({ message: 'Erro ao obter orçamentos', error: error.message });
  }
});

router.get('/orcamentos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [orcamento] = await db.select().from(quotes).where(eq(quotes.id, parseInt(id)));
    
    if (!orcamento) {
      return res.status(404).json({ message: 'Orçamento não encontrado' });
    }
    
    res.json(orcamento);
  } catch (error: any) {
    console.error('Erro ao obter orçamento:', error);
    res.status(500).json({ message: 'Erro ao obter orçamento', error: error.message });
  }
});

router.post('/orcamentos', async (req: Request, res: Response) => {
  try {
    const parsed = insertQuoteSchema.safeParse(req.body);
    
    if (!parsed.success) {
      return res.status(400).json({ message: 'Dados de orçamento inválidos', errors: parsed.error.errors });
    }
    
    // Em uma implementação real, faríamos uma transação para inserir o orçamento e seus itens
    
    const [orcamento] = await db.insert(quotes).values(parsed.data).returning();
    
    res.status(201).json(orcamento);
  } catch (error: any) {
    console.error('Erro ao criar orçamento:', error);
    res.status(500).json({ message: 'Erro ao criar orçamento', error: error.message });
  }
});

router.delete('/orcamentos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se o orçamento existe
    const [orcamento] = await db.select().from(quotes).where(eq(quotes.id, parseInt(id)));
    
    if (!orcamento) {
      return res.status(404).json({ message: 'Orçamento não encontrado' });
    }
    
    // Em uma implementação real, faríamos uma transação para excluir o orçamento e seus itens
    
    // Excluir o orçamento
    await db.delete(quotes).where(eq(quotes.id, parseInt(id)));
    
    res.json({ message: 'Orçamento excluído com sucesso' });
  } catch (error: any) {
    console.error('Erro ao excluir orçamento:', error);
    res.status(500).json({ message: 'Erro ao excluir orçamento', error: error.message });
  }
});

export default router;