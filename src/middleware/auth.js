/**
 * Middleware de autenticação por API Key
 * Valida se a API Key fornecida está entre as chaves autorizadas
 */

const jwt = require('jsonwebtoken');
const { UsuariosModel, UsuariosTiposModel } = require('../models');

const validateApiKey = (req, res, next) => {
  // Obter a API Key do cabeçalho da requisição
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  
  // Verificar se a API Key foi fornecida
  if (!apiKey) {
    return res.status(401).json({
      error: 'Não autorizado',
      message: 'API Key é obrigatória. Inclua no cabeçalho X-API-Key ou Authorization.'
    });
  }

  // Obter as chaves autorizadas do arquivo .env
  const authorizedKeys = process.env.AUTHORIZED_API_KEYS;
  
  if (!authorizedKeys) {
    console.error('⚠️  AUTHORIZED_API_KEYS não configurado no arquivo .env');
    return res.status(500).json({
      error: 'Erro de configuração',
      message: 'Servidor não configurado corretamente'
    });
  }

  // Separar as chaves autorizadas (caso haja múltiplas separadas por vírgula)
  const validKeys = authorizedKeys.split(',').map(key => key.trim());
  
  // Verificar se a API Key fornecida é válida
  if (!validKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Acesso negado',
      message: 'API Key inválida'
    });
  }

  // API Key válida, continuar para a próxima função
  next();
};

/**
 * Middleware de autenticação JWT
 * Valida se o token JWT fornecido é válido
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Obter o token do cabeçalho Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso requerido'
      });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar o usuário no banco de dados
    const usuario = await UsuariosModel.findByPk(decoded.id, {
      attributes: { exclude: ['senha'] },
      include: [
        {
          model: UsuariosTiposModel,
          as: 'tipoUsuario',
          attributes: ['id', 'nome']
        }
      ]
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido - usuário não encontrado'
      });
    }

    // Anexar informações do usuário à requisição
    req.user = usuario;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Middleware para verificar se o usuário é admin
 */
const requireAdmin = (req, res, next) => {
  if (req.user.id_usuarios_tipos !== 1) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
    });
  }
  next();
};

/**
 * Logs de auditoria
 */
const logApiUsage = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  const maskedApiKey = apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'N/A';
  
  console.log(`[${timestamp}] API Request: ${req.method} ${req.originalUrl} | API Key: ${maskedApiKey} | IP: ${req.ip}`);
  
  next();
};

module.exports = {
  validateApiKey,
  authenticateToken,
  requireAdmin,
  logApiUsage
};