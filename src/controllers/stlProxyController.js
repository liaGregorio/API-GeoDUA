/**
 * Controller para proxy de arquivos STL do Google Drive
 * 
 * Este controller é necessário para evitar problemas de CORS
 * ao carregar arquivos STL diretamente do Google Drive
 */

/**
 * Faz proxy de um arquivo STL do Google Drive
 * 
 * @route GET /api/stl-proxy/:fileId
 * @param {string} fileId - ID do arquivo no Google Drive
 * @returns {Buffer} Arquivo STL em formato binário
 */
const getStlFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    // Validar fileId (apenas caracteres alfanuméricos, _ e -)
    if (!/^[a-zA-Z0-9_-]+$/.test(fileId)) {
      return res.status(400).json({ 
        error: 'ID de arquivo inválido',
        message: 'O ID do arquivo contém caracteres inválidos'
      });
    }
    
    // URL de download direto do Google Drive
    const googleDriveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    // Fazer requisição ao Google Drive usando fetch nativo (Node 18+)
    const response = await fetch(googleDriveUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GeoDUA-STL-Proxy/1.0)'
      }
    });
    
    if (!response.ok) {
      console.error(`[STL Proxy] Erro ao baixar do Google Drive: ${response.status}`);
      return res.status(response.status).json({ 
        error: 'Erro ao baixar arquivo do Google Drive',
        status: response.status,
        message: 'Verifique se o arquivo existe e está compartilhado publicamente'
      });
    }
    
    // Obter o conteúdo do arquivo como buffer
    const buffer = await response.arrayBuffer();
    
    // Configurar headers de resposta
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', buffer.byteLength);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache de 1 dia
    
    // Enviar o arquivo
    res.send(Buffer.from(buffer));
    
  } catch (error) {
    console.error('[STL Proxy] Erro:', error);
    res.status(500).json({ 
      error: 'Erro ao carregar arquivo STL',
      message: error.message 
    });
  }
};

module.exports = {
  getStlFile
};
