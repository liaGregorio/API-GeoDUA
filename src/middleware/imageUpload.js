const UPLOAD_CONFIG = require('../config/upload');

// Middleware para validar uploads de imagens
const validateImageUpload = (req, res, next) => {
  // Verificar se é uma requisição que pode conter imagens
  if (req.method === 'POST' || req.method === 'PUT') {
    const { conteudo, content_type } = req.body;
    
    // Se há conteúdo e é um tipo de imagem
    if (conteudo && content_type && content_type.startsWith('image/')) {
      try {
        // Estimar tamanho do base64 (aproximadamente 4/3 do tamanho original)
        const sizeInBytes = (conteudo.length * 3) / 4;
        const sizeInMB = sizeInBytes / (1024 * 1024);
        
        console.log(`Imagem recebida - Tamanho estimado: ${sizeInMB.toFixed(2)} MB, Tipo: ${content_type}`);
        
        // Verificar se é maior que o limite configurado
        if (sizeInMB > UPLOAD_CONFIG.MAX_IMAGE_SIZE_MB) {
          return res.status(413).json({
            error: 'Imagem muito grande',
            message: `A imagem tem ${sizeInMB.toFixed(2)} MB. O limite é de ${UPLOAD_CONFIG.MAX_IMAGE_SIZE_MB}MB. Por favor, comprima a imagem.`,
            code: 'IMAGE_TOO_LARGE'
          });
        }
        
        // Verificar se o formato é suportado
        if (!UPLOAD_CONFIG.SUPPORTED_IMAGE_TYPES.includes(content_type)) {
          return res.status(400).json({
            error: 'Formato de imagem não suportado',
            message: `Formato ${content_type} não é suportado. Use: ${UPLOAD_CONFIG.SUPPORTED_IMAGE_TYPES.join(', ')}.`,
            code: 'UNSUPPORTED_FORMAT'
          });
        }
        
      } catch (error) {
        console.error('Erro ao validar imagem:', error);
        return res.status(400).json({
          error: 'Erro ao processar imagem',
          message: 'Os dados da imagem estão corrompidos ou em formato inválido.',
          code: 'INVALID_IMAGE_DATA'
        });
      }
    }
    
    // Validar áudios também
    if (conteudo && content_type && content_type.startsWith('audio/')) {
      try {
        const sizeInBytes = (conteudo.length * 3) / 4;
        const sizeInMB = sizeInBytes / (1024 * 1024);
        
        console.log(`Áudio recebido - Tamanho estimado: ${sizeInMB.toFixed(2)} MB, Tipo: ${content_type}`);
        
        // Limite um pouco maior para áudios (9MB)
        if (sizeInMB > 9) {
          return res.status(413).json({
            error: 'Áudio muito grande',
            message: `O áudio tem ${sizeInMB.toFixed(2)} MB. O limite é de 9MB. Por favor, comprima o áudio.`,
            code: 'AUDIO_TOO_LARGE'
          });
        }
        
        // Verificar se o formato é suportado
        if (!UPLOAD_CONFIG.SUPPORTED_AUDIO_TYPES.includes(content_type)) {
          return res.status(400).json({
            error: 'Formato de áudio não suportado',
            message: `Formato ${content_type} não é suportado. Use: ${UPLOAD_CONFIG.SUPPORTED_AUDIO_TYPES.join(', ')}.`,
            code: 'UNSUPPORTED_AUDIO_FORMAT'
          });
        }
        
      } catch (error) {
        console.error('Erro ao validar áudio:', error);
        return res.status(400).json({
          error: 'Erro ao processar áudio',
          message: 'Os dados do áudio estão corrompidos ou em formato inválido.',
          code: 'INVALID_AUDIO_DATA'
        });
      }
    }
  }
  
  next();
};

module.exports = { validateImageUpload };
