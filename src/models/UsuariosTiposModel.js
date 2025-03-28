const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UsuariosTiposModel = sequelize.define('UsuarioTipo', {
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
  tableName: 'usuarios_tipos',
  timestamps: false,
  underscored: false
});

module.exports = UsuariosTiposModel;