const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UsuariosTiposModel = require('./UsuariosTiposModel');

const UsuariosModel = sequelize.define('UsuariosModel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: true // Permitir null para usuários do Google
  },
  id_usuarios_tipos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios_tipos',
      key: 'id'
    }
  },
  google_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  }
}, {
  tableName: 'usuarios',       
  timestamps: false,
  underscored: false   
});

module.exports = UsuariosModel;