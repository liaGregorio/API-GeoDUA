const UsuariosModel = require('./UsuariosModel');
const UsuariosTiposModel = require('./UsuariosTiposModel');

UsuariosModel.belongsTo(UsuariosTiposModel, { 
  foreignKey: 'tipo',
  as: 'tipoUsuario'
});

UsuariosTiposModel.hasMany(UsuariosModel, { 
  foreignKey: 'tipo',
  as: 'usuarios'
});

module.exports = {
  UsuariosModel,
  UsuariosTiposModel
};