const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AudioModel = sequelize.define('Audio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  conteudo: {
    type: DataTypes.BLOB,
    allowNull: false,
    field: 'conteudo'
  },
  content_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: 'content_type'
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
  tableName: 'audio',
  timestamps: false,
  indexes: [
    {
      fields: ['id_capitulo']
    }
  ]
});

module.exports = AudioModel;
