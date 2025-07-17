const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const database = require('./config/database');
const { validateImageUpload } = require('./middleware/imageUpload');
const UPLOAD_CONFIG = require('./config/upload');

const app = express();

// Middleware para processar JSON com limite aumentado para imagens
app.use(express.json({ limit: UPLOAD_CONFIG.MAX_JSON_SIZE }));

// Middleware para processar dados de formulários com limite aumentado
app.use(express.urlencoded({ limit: UPLOAD_CONFIG.MAX_JSON_SIZE, extended: true }));

// Configuração do CORS
app.use(cors());

// Middleware para monitorar tamanho das requisições
app.use((req, res, next) => {
  const contentLength = req.headers['content-length'];
  if (contentLength) {
    const sizeInMB = (contentLength / 1024 / 1024).toFixed(2);
    console.log(`Request size: ${sizeInMB} MB`);
  }
  next();
});

// Middleware para validar uploads de imagens
app.use(validateImageUpload);

// Rota de saúde/status da API (sem autenticação)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API está funcionando' });
});

// Rota de teste para autenticação (com middleware de API Key)
app.get('/api/test-auth', require('./middleware/auth').validateApiKey, (req, res) => {
  res.status(200).json({ 
    message: 'Autenticação bem-sucedida!',
    timestamp: new Date().toISOString()
  });
});

// Registra todas as rotas da aplicação
app.use('/api', routes);

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Tratar erro de payload muito grande
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Arquivo muito grande',
      message: 'O arquivo enviado excede o limite de 10MB. Por favor, comprima a imagem e tente novamente.',
      code: 'PAYLOAD_TOO_LARGE'
    });
  }
  
  // Tratar outros erros de parsing do body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Erro ao processar dados',
      message: 'Os dados enviados estão em formato inválido.',
      code: 'PARSE_ERROR'
    });
  }
  
  // Erro genérico
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro inesperado.'
  });
});

// Rota para lidar com endpoints não encontrados
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Função para testar a conexão com o banco de dados
const testDatabaseConnection = async () => {
  try {
    await database.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
};

module.exports = { app, testDatabaseConnection };