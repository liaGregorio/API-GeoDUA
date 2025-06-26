const express = require('express');
const router = express.Router();
const { 
  getLivros, 
  getLivroById, 
  createLivro,
  updateLivro,
  deleteLivro
} = require('../controllers/livrosController');

// GET /api/livros - Listar todos os livros
router.get('/', getLivros);

// GET /api/livros/:id - Buscar livro por ID
router.get('/:id', getLivroById);

// POST /api/livros - Criar novo livro
router.post('/', createLivro);

// PUT /api/livros/:id - Atualizar livro
router.put('/:id', updateLivro);

// DELETE /api/livros/:id - Deletar livro
router.delete('/:id', deleteLivro);

module.exports = router;
