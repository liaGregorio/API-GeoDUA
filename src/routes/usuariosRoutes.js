const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Rota para obter todos os usuários
router.get('/', usuariosController.getAllUsuarios);

// Rota para obter um usuário específico pelo ID
router.get('/:id', usuariosController.getUsuarioById);


module.exports = router;