const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AcessibilidadesModel = sequelize.define('Acessibilidade', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'acessibilidades',   // Nome exato da tabela no banco de dados
  timestamps: false,              // Se a tabela tiver campos created_at e updated_at
  underscored: false              // Para usar snake_case nas colunas no DB
});

module.exports = AcessibilidadesModel;