const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ImagemModel = sequelize.define('Imagem', {
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
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descricao'
  },
  content_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: 'content_type'
  },
  ordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'ordem'
  },
  id_secao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'secao',
      key: 'id'
    },
    field: 'id_secao'
  }
}, {
  tableName: 'imagem',
  timestamps: false,
  indexes: [
    {
      fields: ['id_secao']
    },
    {
      fields: ['ordem']
    }
  ]
});

module.exports = ImagemModel;
