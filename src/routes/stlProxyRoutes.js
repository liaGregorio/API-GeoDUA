const express = require('express');
const router = express.Router();
const { getStlFile } = require('../controllers/stlProxyController');

// GET /api/stl-proxy/:fileId - Fazer proxy de arquivo STL do Google Drive
router.get('/:fileId', getStlFile);

module.exports = router;
