const UsuariosModel = require('./UsuariosModel');
const AcessibilidadesModel = require('./AcessibilidadesModel');
const UsuariosTiposModel = require('./UsuariosTiposModel');

UsuariosModel.belongsTo(AcessibilidadesModel, { 
  foreignKey: 'acessibilidade',
  as: 'dadosAcessibilidade'
});

UsuariosModel.belongsTo(UsuariosTiposModel, { 
  foreignKey: 'tipo',
  as: 'tipoUsuario'
});

AcessibilidadesModel.hasMany(UsuariosModel, { 
  foreignKey: 'acessibilidade',
  as: 'usuarios'
});

UsuariosTiposModel.hasMany(UsuariosModel, { 
  foreignKey: 'tipo',
  as: 'usuarios'
});

module.exports = {
  UsuariosModel,
  AcessibilidadesModel,
  UsuariosTiposModel
};