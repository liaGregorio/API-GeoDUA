const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CapituloModel = sequelize.define('CapituloModel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  id_capitulo_original: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'capitulos',
      key: 'id'
    }
  },
  id_livro: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'livros',
      key: 'id'
    }
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, {
  tableName: 'capitulos',       
  timestamps: false,
  underscored: false   
});

module.exports = CapituloModel;
