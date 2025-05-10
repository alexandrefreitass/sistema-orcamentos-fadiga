import * as db from '../database.mjs';

// Obter todos os produtos
export const getProdutos = async (req, res) => {
  try {
    const produtos = await db.query('SELECT * FROM produtos');
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    res.status(500).json({ message: 'Erro ao obter produtos', error: error.message });
  }
};

// Obter um produto específico por ID
export const getProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const [produto] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);
    
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    res.json(produto);
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    res.status(500).json({ message: 'Erro ao obter produto', error: error.message });
  }
};

// Criar um novo produto
export const createProduto = async (req, res) => {
  try {
    const { descricao, foto, valor } = req.body;
    
    if (!descricao || !valor) {
      return res.status(400).json({ message: 'Descrição e valor são obrigatórios' });
    }
    
    const result = await db.query(
      'INSERT INTO produtos (descricao, foto, valor) VALUES (?, ?, ?)',
      [descricao, foto || null, valor]
    );
    
    const newProduto = {
      id: result.insertId,
      descricao,
      foto,
      valor
    };
    
    res.status(201).json(newProduto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
  }
};

// Atualizar um produto existente
export const updateProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, foto, valor } = req.body;
    
    // Verificar se o produto existe
    const [produto] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);
    
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    // Atualizar o produto
    await db.query(
      'UPDATE produtos SET descricao = ?, foto = ?, valor = ? WHERE id = ?',
      [
        descricao || produto.descricao,
        foto !== undefined ? foto : produto.foto,
        valor || produto.valor,
        id
      ]
    );
    
    // Obter o produto atualizado
    const [updatedProduto] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);
    
    res.json(updatedProduto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
  }
};

// Excluir um produto
export const deleteProduto = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o produto existe
    const [produto] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);
    
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    // Verificar se o produto está sendo usado em algum orçamento
    const [orcamentoProdutos] = await db.query(
      'SELECT COUNT(*) AS count FROM orcamento_produtos WHERE id_produto = ?',
      [id]
    );
    
    if (orcamentoProdutos.count > 0) {
      return res.status(400).json({
        message: 'Este produto não pode ser excluído pois está sendo usado em um ou mais orçamentos'
      });
    }
    
    // Excluir o produto
    await db.query('DELETE FROM produtos WHERE id = ?', [id]);
    
    res.json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ message: 'Erro ao excluir produto', error: error.message });
  }
};