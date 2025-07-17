const express = require('express');
const router = express.Router();
const { 
  getAudios, 
  getAudioById, 
  createAudio,
  updateAudio,
  deleteAudio
} = require('../controllers/audiosController');

// GET /api/audios/capitulo/:idCapitulo - Listar áudios de um capítulo específico
router.get('/capitulo/:idCapitulo', getAudios);

// GET /api/audios/:id - Buscar áudio por ID
router.get('/:id', getAudioById);

// POST /api/audios - Criar novo áudio
router.post('/', createAudio);

// PUT /api/audios/:id - Atualizar áudio
router.put('/:id', updateAudio);

// DELETE /api/audios/:id - Deletar áudio
router.delete('/:id', deleteAudio);

module.exports = router;
