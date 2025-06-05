const UsuariosModel = require('./UsuariosModel');
const UsuariosTiposModel = require('./UsuariosTiposModel');

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
  UsuariosTiposModel
};