const { CapituloModel, LivroModel, UsuariosModel, SecaoModel, ImagemModel, AudioModel } = require('../models');

// GET - Listar capítulos de um livro específico
const getCapitulos = async (req, res) => {
  try {
    const { idLivro } = req.params;

    // Verificar se o livro existe
    const livro = await LivroModel.findByPk(idLivro);
    if (!livro) {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }

    const capitulos = await CapituloModel.findAll({
      where: { id_livro: idLivro },
      include: [
        {
          model: LivroModel,
          as: 'livro',
          attributes: ['id', 'nome']
        },
        {
          model: UsuariosModel,
          as: 'usuario',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: CapituloModel,
          as: 'capituloOriginal',
          attributes: ['id', 'nome']
        }
      ],
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: capitulos,
      message: 'Capítulos listados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar capítulos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET - Buscar capítulo por ID
const getCapituloById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const capitulo = await CapituloModel.findByPk(id, {
      include: [
        {
          model: LivroModel,
          as: 'livro',
          attributes: ['id', 'nome']
        },
        {
          model: UsuariosModel,
          as: 'usuario',
          attributes: ['id', 'nome', 'email']
        },
        {
          model: CapituloModel,
          as: 'capituloOriginal',
          attributes: ['id', 'nome']
        },
        {
          model: CapituloModel,
          as: 'rascunhos',
          attributes: ['id', 'nome', 'id_usuario']
        }
      ]
    });
    
    if (!capitulo) {
      return res.status(404).json({
        success: false,
        message: 'Capítulo não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: capitulo,
      message: 'Capítulo encontrado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar capítulo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST - Criar novo capítulo
const createCapitulo = async (req, res) => {
  try {
    const { nome, id_livro, id_usuario, id_capitulo_original } = req.body;

    // Validações básicas
    if (!nome || !id_livro || !id_usuario) {
      return res.status(400).json({
        success: false,
        message: 'Nome, ID do livro e ID do usuário são obrigatórios'
      });
    }

    // Verificar se o livro existe
    const livro = await LivroModel.findByPk(id_livro);
    if (!livro) {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }

    // Verificar se o usuário existe
    const usuario = await UsuariosModel.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Se tem id_capitulo_original, verificar se existe
    if (id_capitulo_original) {
      const capituloOriginal = await CapituloModel.findByPk(id_capitulo_original);
      if (!capituloOriginal) {
        return res.status(404).json({
          success: false,
          message: 'Capítulo original não encontrado'
        });
      }
    }

    const novoCapitulo = await CapituloModel.create({
      nome,
      id_livro,
      id_usuario,
      id_capitulo_original: id_capitulo_original || null
    });

    res.status(201).json({
      success: true,
      data: novoCapitulo,
      message: 'Capítulo criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar capítulo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT - Atualizar capítulo
const updateCapitulo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, id_livro, id_usuario, id_capitulo_original } = req.body;

    const capitulo = await CapituloModel.findByPk(id);
    if (!capitulo) {
      return res.status(404).json({
        success: false,
        message: 'Capítulo não encontrado'
      });
    }

    // Verificar se o livro existe (se fornecido)
    if (id_livro) {
      const livro = await LivroModel.findByPk(id_livro);
      if (!livro) {
        return res.status(404).json({
          success: false,
          message: 'Livro não encontrado'
        });
      }
    }

    // Verificar se o usuário existe (se fornecido)
    if (id_usuario) {
      const usuario = await UsuariosModel.findByPk(id_usuario);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
    }

    // Se tem id_capitulo_original, verificar se existe
    if (id_capitulo_original) {
      const capituloOriginal = await CapituloModel.findByPk(id_capitulo_original);
      if (!capituloOriginal) {
        return res.status(404).json({
          success: false,
          message: 'Capítulo original não encontrado'
        });
      }
    }

    const capituloAtualizado = await capitulo.update({
      nome: nome || capitulo.nome,
      id_livro: id_livro || capitulo.id_livro,
      id_usuario: id_usuario || capitulo.id_usuario,
      id_capitulo_original: id_capitulo_original !== undefined ? id_capitulo_original : capitulo.id_capitulo_original
    });

    res.status(200).json({
      success: true,
      data: capituloAtualizado,
      message: 'Capítulo atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar capítulo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE - Deletar capítulo
const deleteCapitulo = async (req, res) => {
  try {
    const { id } = req.params;

    const capitulo = await CapituloModel.findByPk(id);
    if (!capitulo) {
      return res.status(404).json({
        success: false,
        message: 'Capítulo não encontrado'
      });
    }

    // Buscar rascunhos que referenciam este capítulo
    const rascunhos = await CapituloModel.findAll({
      where: { id_capitulo_original: id }
    });

    // Buscar seções que pertencem a este capítulo
    const secoes = await SecaoModel.findAll({
      where: { id_capitulo: id }
    });

    // Buscar seções que pertencem aos rascunhos deste capítulo
    let secoesRascunhos = [];
    if (rascunhos.length > 0) {
      const idsRascunhos = rascunhos.map(r => r.id);
      secoesRascunhos = await SecaoModel.findAll({
        where: { id_capitulo: idsRascunhos }
      });
    }

    const todasSecoes = [...secoes, ...secoesRascunhos];

    // Buscar áudios que pertencem a este capítulo e aos rascunhos
    const idsCapitulosParaExcluir = [id, ...rascunhos.map(r => r.id)];
    const audios = await AudioModel.findAll({
      where: { id_capitulo: idsCapitulosParaExcluir }
    });

    // Buscar e excluir imagens das seções
    if (todasSecoes.length > 0) {
      const idsSecoes = todasSecoes.map(s => s.id);
      
      // Excluir imagens das seções
      await ImagemModel.destroy({
        where: { id_secao: idsSecoes }
      });

      // Excluir seções
      await SecaoModel.destroy({
        where: { id: idsSecoes }
      });
    }

    // Excluir áudios
    if (audios.length > 0) {
      await AudioModel.destroy({
        where: { id_capitulo: idsCapitulosParaExcluir }
      });
    }

    // Excluir rascunhos
    if (rascunhos.length > 0) {
      await CapituloModel.destroy({
        where: { id_capitulo_original: id }
      });
    }

    // Excluir o capítulo principal
    await capitulo.destroy();

    const totalRascunhos = rascunhos.length;
    const totalSecoes = todasSecoes.length;
    const totalAudios = audios.length;
    
    let mensagem = 'Capítulo deletado com sucesso';
    if (totalRascunhos > 0 || totalSecoes > 0 || totalAudios > 0) {
      const detalhes = [];
      if (totalRascunhos > 0) detalhes.push(`${totalRascunhos} rascunho(s)`);
      if (totalSecoes > 0) detalhes.push(`${totalSecoes} seção(ões) e suas imagens`);
      if (totalAudios > 0) detalhes.push(`${totalAudios} áudio(s)`);
      mensagem += ` (${detalhes.join(', ')} também foram excluído(s))`;
    }

    res.status(200).json({
      success: true,
      message: mensagem
    });
  } catch (error) {
    console.error('Erro ao deletar capítulo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET - Buscar rascunhos de um usuário
const getRascunhosByUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    // Verificar se o usuário existe
    const usuario = await UsuariosModel.findByPk(idUsuario);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Buscar rascunhos do usuário (capítulos que têm id_capitulo_original)
    const rascunhos = await CapituloModel.findAll({
      where: { 
        id_usuario: idUsuario,
        id_capitulo_original: { [require('sequelize').Op.ne]: null }
      },
      include: [
        {
          model: CapituloModel,
          as: 'capituloOriginal',
          attributes: ['id', 'nome'],
          include: [{
            model: LivroModel,
            as: 'livro',
            attributes: ['id', 'nome']
          }]
        }
      ],
      order: [['id', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: rascunhos,
      message: 'Rascunhos encontrados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar rascunhos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST - Criar rascunho
const createRascunho = async (req, res) => {
  try {
    const { id_usuario, id_capitulo_original, nome } = req.body;

    // Validações básicas
    if (!id_usuario || !id_capitulo_original) {
      return res.status(400).json({
        success: false,
        message: 'ID do usuário e ID do capítulo original são obrigatórios'
      });
    }

    // Verificar se o usuário existe
    const usuario = await UsuariosModel.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se o capítulo original existe
    const capituloOriginal = await CapituloModel.findByPk(id_capitulo_original);
    if (!capituloOriginal) {
      return res.status(404).json({
        success: false,
        message: 'Capítulo original não encontrado'
      });
    }

    // Verificar se já existe um rascunho deste usuário para este capítulo
    const rascunhoExistente = await CapituloModel.findOne({
      where: {
        id_usuario,
        id_capitulo_original
      }
    });

    if (rascunhoExistente) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um rascunho deste usuário para este capítulo',
        data: rascunhoExistente
      });
    }

    // Criar o rascunho
    const novoRascunho = await CapituloModel.create({
      nome: nome || `Rascunho - ${capituloOriginal.nome}`,
      id_livro: capituloOriginal.id_livro,
      id_usuario,
      id_capitulo_original
    });

    res.status(201).json({
      success: true,
      data: novoRascunho,
      message: 'Rascunho criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar rascunho:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getCapitulos,
  getCapituloById,
  createCapitulo,
  updateCapitulo,
  deleteCapitulo,
  getRascunhosByUsuario,
  createRascunho
};
