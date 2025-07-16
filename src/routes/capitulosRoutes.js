const express = require('express');
const router = express.Router();
const { 
  getCapitulos, 
  getCapituloById, 
  createCapitulo,
  updateCapitulo,
  deleteCapitulo,
  getRascunhosByUsuario,
  createRascunho
} = require('../controllers/capitulosController');

// GET /api/capitulos/livro/:idLivro - Listar capítulos de um livro específico
router.get('/livro/:idLivro', getCapitulos);

// GET /api/capitulos/:id - Buscar capítulo por ID
router.get('/:id', getCapituloById);

// POST /api/capitulos - Criar novo capítulo
router.post('/', createCapitulo);

// PUT /api/capitulos/:id - Atualizar capítulo
router.put('/:id', updateCapitulo);

// DELETE /api/capitulos/:id - Deletar capítulo
router.delete('/:id', deleteCapitulo);

// GET /api/capitulos/rascunhos/usuario/:idUsuario - Buscar rascunhos de um usuário
router.get('/rascunhos/usuario/:idUsuario', getRascunhosByUsuario);

// POST /api/capitulos/rascunhos - Criar rascunho
router.post('/rascunhos', createRascunho);

module.exports = router;
