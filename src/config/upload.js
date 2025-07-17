// Configurações de upload
const UPLOAD_CONFIG = {
  // Limite máximo para requisições JSON (10MB)
  MAX_JSON_SIZE: '10mb',
  
  // Limite máximo para imagens (8MB - deixando margem para outros dados)
  MAX_IMAGE_SIZE_MB: 8,
  
  // Tipos de arquivo suportados
  SUPPORTED_IMAGE_TYPES: [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp'
  ],
  
  // Tipos de áudio suportados
  SUPPORTED_AUDIO_TYPES: [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/webm'
  ],
  
  // Configurações de compressão recomendadas
  COMPRESSION_SETTINGS: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format: 'image/jpeg'
  }
};

module.exports = UPLOAD_CONFIG;
