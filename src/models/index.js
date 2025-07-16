const UsuariosModel = require('./UsuariosModel');
const UsuariosTiposModel = require('./UsuariosTiposModel');
const LivroModel = require('./LivroModel');
const CapituloModel = require('./CapituloModel');

// Associações entre Usuarios e UsuariosTipos
UsuariosModel.belongsTo(UsuariosTiposModel, { 
  foreignKey: 'id_usuarios_tipos',
  as: 'tipoUsuario'
});

UsuariosTiposModel.hasMany(UsuariosModel, { 
  foreignKey: 'id_usuarios_tipos',
  as: 'usuarios'
});

// Associações entre Capitulo e Livro
CapituloModel.belongsTo(LivroModel, {
  foreignKey: 'id_livro',
  as: 'livro'
});

LivroModel.hasMany(CapituloModel, {
  foreignKey: 'id_livro',
  as: 'capitulos'
});

// Associações entre Capitulo e Usuario
CapituloModel.belongsTo(UsuariosModel, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

UsuariosModel.hasMany(CapituloModel, {
  foreignKey: 'id_usuario',
  as: 'capitulos'
});

// Auto-associação para rascunhos de capítulos
CapituloModel.belongsTo(CapituloModel, {
  foreignKey: 'id_capitulo_original',
  as: 'capituloOriginal'
});

CapituloModel.hasMany(CapituloModel, {
  foreignKey: 'id_capitulo_original',
  as: 'rascunhos'
});

module.exports = {
  UsuariosModel,
  UsuariosTiposModel,
  LivroModel,
  CapituloModel
};