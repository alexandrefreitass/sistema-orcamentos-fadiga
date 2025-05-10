import express from 'express';
import * as produtosController from '../controllers/produtosController.mjs';
import * as clientesController from '../controllers/clientesController.mjs';
import * as orcamentosController from '../controllers/orcamentosController.mjs';

const router = express.Router();

// Rotas para produtos
router.get('/produtos', produtosController.getProdutos);
router.get('/produtos/:id', produtosController.getProduto);
router.post('/produtos', produtosController.createProduto);
router.put('/produtos/:id', produtosController.updateProduto);
router.delete('/produtos/:id', produtosController.deleteProduto);

// Rotas para clientes
router.get('/clientes', clientesController.getClientes);
router.get('/clientes/:id', clientesController.getCliente);
router.post('/clientes', clientesController.createCliente);
router.put('/clientes/:id', clientesController.updateCliente);
router.delete('/clientes/:id', clientesController.deleteCliente);

// Rotas para orçamentos
router.get('/orcamentos', orcamentosController.getOrcamentos);
router.get('/orcamentos/:id', orcamentosController.getOrcamento);
router.post('/orcamentos', orcamentosController.createOrcamento);
router.delete('/orcamentos/:id', orcamentosController.deleteOrcamento);

export default router;