const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SecaoModel = sequelize.define('Secao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'prompt'
  },
  titulo: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'titulo'
  },
  resumo: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'resumo'
  },
  ordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'ordem'
  },
  original: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'original'
  },
  link3d: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'link3d'
  },
  feedback: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'feedback'
  },
  ordem3d: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'ordem3d'
  },
  id_capitulo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'capitulos',
      key: 'id'
    },
    field: 'id_capitulo'
  }
}, {
  tableName: 'secao',
  timestamps: false,
  indexes: [
    {
      fields: ['id_capitulo']
    },
    {
      fields: ['ordem']
    }
  ]
});

module.exports = SecaoModel;
