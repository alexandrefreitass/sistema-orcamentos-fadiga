import * as db from '../database.mjs';

// Obter todos os clientes
export const getClientes = async (req, res) => {
  try {
    const clientes = await db.query('SELECT * FROM clientes');
    res.json(clientes);
  } catch (error) {
    console.error('Erro ao obter clientes:', error);
    res.status(500).json({ message: 'Erro ao obter clientes', error: error.message });
  }
};

// Obter um cliente específico por ID
export const getCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const [cliente] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    res.status(500).json({ message: 'Erro ao obter cliente', error: error.message });
  }
};

// Criar um novo cliente
export const createCliente = async (req, res) => {
  try {
    const { nome, telefone, email } = req.body;
    
    if (!nome) {
      return res.status(400).json({ message: 'Nome é obrigatório' });
    }
    
    const result = await db.query(
      'INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)',
      [nome, telefone || null, email || null]
    );
    
    const newCliente = {
      id: result.insertId,
      nome,
      telefone,
      email
    };
    
    res.status(201).json(newCliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ message: 'Erro ao criar cliente', error: error.message });
  }
};

// Atualizar um cliente existente
export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone, email } = req.body;
    
    // Verificar se o cliente existe
    const [cliente] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    // Atualizar o cliente
    await db.query(
      'UPDATE clientes SET nome = ?, telefone = ?, email = ? WHERE id = ?',
      [
        nome || cliente.nome,
        telefone !== undefined ? telefone : cliente.telefone,
        email !== undefined ? email : cliente.email,
        id
      ]
    );
    
    // Obter o cliente atualizado
    const [updatedCliente] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
    
    res.json(updatedCliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
  }
};

// Excluir um cliente
export const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o cliente existe
    const [cliente] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    
    // Verificar se o cliente está sendo usado em algum orçamento
    const [orcamentos] = await db.query(
      'SELECT COUNT(*) AS count FROM orcamentos WHERE id_cliente = ?',
      [id]
    );
    
    if (orcamentos.count > 0) {
      return res.status(400).json({
        message: 'Este cliente não pode ser excluído pois possui um ou mais orçamentos'
      });
    }
    
    // Excluir o cliente
    await db.query('DELETE FROM clientes WHERE id = ?', [id]);
    
    res.json({ message: 'Cliente excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ message: 'Erro ao excluir cliente', error: error.message });
  }
};