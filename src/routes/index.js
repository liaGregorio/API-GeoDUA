const express = require('express');
const router = express.Router();
const usuariosRoutes = require('./usuariosRoutes');
const livrosRoutes = require('./livrosRoutes');

router.use('/usuarios', usuariosRoutes);
router.use('/livros', livrosRoutes);

module.exports = router;