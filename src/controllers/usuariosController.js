const sequelize = require('../config/database');
const { UsuariosModel, UsuariosTiposModel } = require('../models');

// Obter todos os usuários
const getAllUsuarios = async (req, res, next) => {
  try {
    const usuarios = await UsuariosModel.findAll({
      attributes: { exclude: ['senha'] }, // Não retorna as senhas
      include: [
        {
          model: UsuariosTiposModel,
          as: 'tipoUsuario',
          attributes: ['id', 'nome']
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: usuarios.length,
      data: usuarios
    });
  } catch (error) {
    next(error);
  }
};

// Obter um usuário pelo ID
const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const usuario = await UsuariosModel.findByPk(id, {
      attributes: { exclude: ['senha'] },
      include: [
        {
          model: UsuariosTiposModel,
          as: 'tipoUsuario',
          attributes: ['id', 'nome']
        }
      ]
    });
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById
};