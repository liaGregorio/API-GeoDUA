const UsuariosModel = require('./UsuariosModel');
const UsuariosTiposModel = require('./UsuariosTiposModel');
const LivroModel = require('./LivroModel');
const CapituloModel = require('./CapituloModel');
const SecaoModel = require('./SecaoModel');
const ImagemModel = require('./ImagemModel');
const AudioModel = require('./AudioModel');

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

// Associações entre Secao e Capitulo
SecaoModel.belongsTo(CapituloModel, {
  foreignKey: 'id_capitulo',
  as: 'capitulo'
});

CapituloModel.hasMany(SecaoModel, {
  foreignKey: 'id_capitulo',
  as: 'secoes'
});

// Associações entre Imagem e Secao
ImagemModel.belongsTo(SecaoModel, {
  foreignKey: 'id_secao',
  as: 'secao'
});

SecaoModel.hasMany(ImagemModel, {
  foreignKey: 'id_secao',
  as: 'imagens'
});

// Associações entre Audio e Capitulo
AudioModel.belongsTo(CapituloModel, {
  foreignKey: 'id_capitulo',
  as: 'capitulo'
});

CapituloModel.hasMany(AudioModel, {
  foreignKey: 'id_capitulo',
  as: 'audios'
});

module.exports = {
  UsuariosModel,
  UsuariosTiposModel,
  LivroModel,
  CapituloModel,
  SecaoModel,
  ImagemModel,
  AudioModel
};