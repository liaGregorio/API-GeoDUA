const express = require('express');
const router = express.Router();
const { 
  getSecoes, 
  getSecaoById, 
  createSecao,
  updateSecao,
  deleteSecao
} = require('../controllers/secoesController');

// GET /api/secoes/capitulo/:idCapitulo - Listar seções de um capítulo específico
router.get('/capitulo/:idCapitulo', getSecoes);

// GET /api/secoes/:id - Buscar seção por ID
router.get('/:id', getSecaoById);

// POST /api/secoes - Criar nova seção
router.post('/', createSecao);

// PUT /api/secoes/:id - Atualizar seção
router.put('/:id', updateSecao);

// DELETE /api/secoes/:id - Deletar seção
router.delete('/:id', deleteSecao);

module.exports = router;
