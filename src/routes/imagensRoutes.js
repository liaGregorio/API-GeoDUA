const express = require('express');
const router = express.Router();
const { 
  getImagens, 
  getImagemById, 
  createImagem,
  updateImagem,
  deleteImagem
} = require('../controllers/imagensController');

// GET /api/imagens/secao/:idSecao - Listar imagens de uma seção específica
router.get('/secao/:idSecao', getImagens);

// GET /api/imagens/:id - Buscar imagem por ID
router.get('/:id', getImagemById);

// POST /api/imagens - Criar nova imagem
router.post('/', createImagem);

// PUT /api/imagens/:id - Atualizar imagem
router.put('/:id', updateImagem);

// DELETE /api/imagens/:id - Deletar imagem
router.delete('/:id', deleteImagem);

module.exports = router;
