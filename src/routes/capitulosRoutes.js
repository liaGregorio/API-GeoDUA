const express = require('express');
const router = express.Router();
const { 
  getCapitulos, 
  getCapituloById, 
  createCapitulo,
  updateCapitulo,
  deleteCapitulo,
  getRascunhosByCapituloUsuario,
  publicarRascunho
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

// GET /api/capitulos/:idCapitulo/rascunhos/usuario/:idUsuario - Buscar rascunhos de um capítulo específico para um usuário
router.get('/:idCapitulo/rascunhos/usuario/:idUsuario', getRascunhosByCapituloUsuario);

// POST /api/capitulos/:id/publicar - Publicar rascunho
router.post('/:id/publicar', publicarRascunho);

module.exports = router;
