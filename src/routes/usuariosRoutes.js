const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Rotas públicas
// Rota para registrar novo usuário
router.post('/registro', usuariosController.registrarUsuario);

// Rota para login de usuário
router.post('/login', usuariosController.loginUsuario);

// Rotas protegidas (necessário estar logado)
// Rota para obter perfil do usuário logado
router.get('/perfil', authenticateToken, usuariosController.getPerfilUsuario);

// Rota para obter todos os usuários - apenas admins
router.get('/', authenticateToken, requireAdmin, usuariosController.getAllUsuarios);

// Rota para obter um usuário específico pelo ID - apenas admins
router.get('/:id', authenticateToken, requireAdmin, usuariosController.getUsuarioById);


module.exports = router;