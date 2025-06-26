const UsuariosModel = require('./UsuariosModel');
const UsuariosTiposModel = require('./UsuariosTiposModel');
const LivroModel = require('./LivroModel');

UsuariosModel.belongsTo(UsuariosTiposModel, { 
  foreignKey: 'id_usuarios_tipos',
  as: 'tipoUsuario'
});

UsuariosTiposModel.hasMany(UsuariosModel, { 
  foreignKey: 'id_usuarios_tipos',
  as: 'usuarios'
});

module.exports = {
  UsuariosModel,
  UsuariosTiposModel,
  LivroModel
};