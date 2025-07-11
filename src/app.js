const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const database = require('./config/database');

const app = express();

// Middleware para processar JSON
app.use(express.json());

// Middleware para processar dados de formulários
app.use(express.urlencoded({ extended: true }));

// Configuração do CORS
app.use(cors());

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
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
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