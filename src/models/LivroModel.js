const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LivroModel = sequelize.define('LivroModel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'livros',       
  timestamps: false,
  underscored: false   
});

module.exports = LivroModel;
