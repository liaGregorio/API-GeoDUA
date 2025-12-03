const express = require('express');
const router = express.Router();
const usuariosRoutes = require('./usuariosRoutes');
const livrosRoutes = require('./livrosRoutes');
const capitulosRoutes = require('./capitulosRoutes');
const secoesRoutes = require('./secoesRoutes');
const imagensRoutes = require('./imagensRoutes');
const audiosRoutes = require('./audiosRoutes');
const stlProxyRoutes = require('./stlProxyRoutes');
const { validateApiKey, logApiUsage } = require('../middleware/auth');

// Aplicar middleware de autenticação em todas as rotas da API
router.use(validateApiKey);

// Middleware para logs (descomente se necessário)
// router.use(logApiUsage);

router.use('/usuarios', usuariosRoutes);
router.use('/livros', livrosRoutes);
router.use('/capitulos', capitulosRoutes);
router.use('/secoes', secoesRoutes);
router.use('/imagens', imagensRoutes);
router.use('/audios', audiosRoutes);
router.use('/stl-proxy', stlProxyRoutes);

module.exports = router;