require('dotenv').config();
const { app, testDatabaseConnection } = require('./src/app');

const PORT = process.env.PORT || 3000;

// Testa a conexão com o banco de dados e inicia o servidor
const startServer = async () => {
  // Testa a conexão com o banco e sincroniza os modelos
  await testDatabaseConnection();
  
  // Inicia o servidor
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV}`);
    console.log(`API disponível em: http://localhost:${PORT}/api/usuarios`);
  });
};

// Inicia o servidor
startServer().catch(err => {
  console.error('Falha ao iniciar o servidor:', err);
  process.exit(1);
});