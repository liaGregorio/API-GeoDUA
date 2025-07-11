const express = require('express');
const router = express.Router();
const usuariosRoutes = require('./usuariosRoutes');
const livrosRoutes = require('./livrosRoutes');
const { validateApiKey, logApiUsage } = require('../middleware/auth');

// Aplicar middleware de autenticação em todas as rotas da API
router.use(validateApiKey);

// Middleware para logs (descomente se necessário)
// router.use(logApiUsage);

router.use('/usuarios', usuariosRoutes);
router.use('/livros', livrosRoutes);

module.exports = router;