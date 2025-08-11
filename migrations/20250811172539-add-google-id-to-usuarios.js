'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Adicionar coluna google_id à tabela usuarios
    await queryInterface.addColumn('usuarios', 'google_id', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    // Modificar coluna senha para permitir null
    await queryInterface.changeColumn('usuarios', 'senha', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    // Remover coluna google_id
    await queryInterface.removeColumn('usuarios', 'google_id');

    // Reverter coluna senha para não permitir null
    await queryInterface.changeColumn('usuarios', 'senha', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
