import * as db from '../database.mjs';

// Obter todos os orçamentos com dados do cliente
export const getOrcamentos = async (req, res) => {
  try {
    const orcamentos = await db.query(`
      SELECT o.*, c.nome as cliente_nome, c.telefone as cliente_telefone, c.email as cliente_email
      FROM orcamentos o
      JOIN clientes c ON o.id_cliente = c.id
      ORDER BY o.id DESC
    `);
    
    // Para cada orçamento, buscar os produtos
    for (let i = 0; i < orcamentos.length; i++) {
      const produtos = await db.query(`
        SELECT op.*, p.descricao, p.foto
        FROM orcamento_produtos op
        JOIN produtos p ON op.id_produto = p.id
        WHERE op.id_orcamento = ?
      `, [orcamentos[i].id]);
      
      orcamentos[i].items = produtos;
    }
    
    res.json(orcamentos);
  } catch (error) {
    console.error('Erro ao obter orçamentos:', error);
    res.status(500).json({ message: 'Erro ao obter orçamentos', error: error.message });
  }
};

// Obter um orçamento específico por ID
export const getOrcamento = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar orçamento com dados do cliente
    const [orcamento] = await db.query(`
      SELECT o.*, c.nome as cliente_nome, c.telefone as cliente_telefone, c.email as cliente_email
      FROM orcamentos o
      JOIN clientes c ON o.id_cliente = c.id
      WHERE o.id = ?
    `, [id]);
    
    if (!orcamento) {
      return res.status(404).json({ message: 'Orçamento não encontrado' });
    }
    
    // Buscar produtos do orçamento
    const produtos = await db.query(`
      SELECT op.*, p.descricao, p.foto
      FROM orcamento_produtos op
      JOIN produtos p ON op.id_produto = p.id
      WHERE op.id_orcamento = ?
    `, [id]);
    
    orcamento.items = produtos;
    
    res.json(orcamento);
  } catch (error) {
    console.error('Erro ao obter orçamento:', error);
    res.status(500).json({ message: 'Erro ao obter orçamento', error: error.message });
  }
};

// Criar um novo orçamento
export const createOrcamento = async (req, res) => {
  try {
    const { id_cliente, mao_obra, suporte_mensal, total, items } = req.body;
    
    if (!id_cliente || !items || items.length === 0) {
      return res.status(400).json({ 
        message: 'Cliente e pelo menos um produto são obrigatórios' 
      });
    }
    
    // Verificar se o cliente existe
    const [cliente] = await db.query('SELECT * FROM clientes WHERE id = ?', [id_cliente]);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    // Iniciar transação
    const connection = await db.pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Inserir orçamento
      const [resultOrcamento] = await connection.execute(
        'INSERT INTO orcamentos (id_cliente, mao_obra, suporte_mensal, total, data_criacao) VALUES (?, ?, ?, ?, NOW())',
        [id_cliente, mao_obra || 0, suporte_mensal || 0, total || 0]
      );
      
      const orcamentoId = resultOrcamento.insertId;
      
      // Inserir produtos do orçamento
      for (const item of items) {
        // Verificar se o produto existe
        const [produto] = await connection.execute(
          'SELECT * FROM produtos WHERE id = ?',
          [item.id_produto]
        );
        
        if (!produto) {
          await connection.rollback();
          connection.release();
          return res.status(404).json({ 
            message: `Produto com ID ${item.id_produto} não encontrado` 
          });
        }
        
        await connection.execute(
          'INSERT INTO orcamento_produtos (id_orcamento, id_produto, quantidade, valor_unitario) VALUES (?, ?, ?, ?)',
          [orcamentoId, item.id_produto, item.quantidade, item.valor_unitario]
        );
      }
      
      // Commit da transação
      await connection.commit();
      connection.release();
      
      // Buscar o orçamento completo para retornar
      const [novoOrcamento] = await db.query(`
        SELECT o.*, c.nome as cliente_nome, c.telefone as cliente_telefone, c.email as cliente_email
        FROM orcamentos o
        JOIN clientes c ON o.id_cliente = c.id
        WHERE o.id = ?
      `, [orcamentoId]);
      
      // Buscar produtos do orçamento
      const produtosOrcamento = await db.query(`
        SELECT op.*, p.descricao, p.foto
        FROM orcamento_produtos op
        JOIN produtos p ON op.id_produto = p.id
        WHERE op.id_orcamento = ?
      `, [orcamentoId]);
      
      novoOrcamento.items = produtosOrcamento;
      
      res.status(201).json(novoOrcamento);
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Erro ao criar orçamento:', error);
    res.status(500).json({ message: 'Erro ao criar orçamento', error: error.message });
  }
};

// Excluir um orçamento
export const deleteOrcamento = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o orçamento existe
    const [orcamento] = await db.query('SELECT * FROM orcamentos WHERE id = ?', [id]);
    
    if (!orcamento) {
      return res.status(404).json({ message: 'Orçamento não encontrado' });
    }
    
    // Iniciar transação
    const connection = await db.pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Excluir produtos do orçamento
      await connection.execute(
        'DELETE FROM orcamento_produtos WHERE id_orcamento = ?',
        [id]
      );
      
      // Excluir orçamento
      await connection.execute(
        'DELETE FROM orcamentos WHERE id = ?',
        [id]
      );
      
      // Commit da transação
      await connection.commit();
      connection.release();
      
      res.json({ message: 'Orçamento excluído com sucesso' });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Erro ao excluir orçamento:', error);
    res.status(500).json({ message: 'Erro ao excluir orçamento', error: error.message });
  }
};