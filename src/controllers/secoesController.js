const { SecaoModel, CapituloModel, ImagemModel, UsuariosModel } = require('../models');

// GET - Listar seções de um capítulo específico
const getSecoes = async (req, res) => {
  try {
    const { idCapitulo } = req.params;

    // Verificar se o capítulo existe
    const capitulo = await CapituloModel.findByPk(idCapitulo);
    if (!capitulo) {
      return res.status(404).json({
        success: false,
        message: 'Capítulo não encontrado'
      });
    }

    const secoes = await SecaoModel.findAll({
      where: { id_capitulo: idCapitulo },
      include: [
        {
          model: CapituloModel,
          as: 'capitulo',
          attributes: ['id', 'nome']
        },
        {
          model: ImagemModel,
          as: 'imagens',
          attributes: ['id', 'conteudo', 'descricao', 'content_type', 'ordem']
        }
      ],
      order: [['ordem', 'ASC'], [{ model: ImagemModel, as: 'imagens' }, 'ordem', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: secoes,
      message: 'Seções listadas com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar seções:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET - Buscar seção por ID
const getSecaoById = async (req, res) => {
  try {
    const { id } = req.params;

    const secao = await SecaoModel.findByPk(id, {
      include: [
        {
          model: CapituloModel,
          as: 'capitulo',
          attributes: ['id', 'nome']
        },
        {
          model: ImagemModel,
          as: 'imagens',
          attributes: ['id', 'conteudo', 'descricao', 'content_type', 'ordem']
        }
      ]
    });

    if (!secao) {
      return res.status(404).json({
        success: false,
        message: 'Seção não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: secao,
      message: 'Seção encontrada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar seção:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST - Criar nova seção
const createSecao = async (req, res) => {
  try {
    const { prompt, titulo, resumo, ordem, original, link3d, feedback, ordem3d, id_capitulo } = req.body;

    // Validações obrigatórias
    if (!ordem || !id_capitulo) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: ordem e id_capitulo'
      });
    }

    // Verificar se o capítulo existe
    const capitulo = await CapituloModel.findByPk(id_capitulo);
    if (!capitulo) {
      return res.status(404).json({
        success: false,
        message: 'Capítulo não encontrado'
      });
    }

    const novaSecao = await SecaoModel.create({
      prompt,
      titulo,
      resumo,
      ordem,
      original,
      link3d,
      feedback: feedback || false,
      ordem3d,
      id_capitulo
    });

    const secaoCriada = await SecaoModel.findByPk(novaSecao.id, {
      include: [
        {
          model: CapituloModel,
          as: 'capitulo',
          attributes: ['id', 'nome']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: secaoCriada,
      message: 'Seção criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar seção:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT - Atualizar seção
const updateSecao = async (req, res) => {
  try {
    const { id } = req.params;
    const { prompt, titulo, resumo, ordem, original, link3d, feedback, ordem3d, id_capitulo } = req.body;

    const secao = await SecaoModel.findByPk(id);
    if (!secao) {
      return res.status(404).json({
        success: false,
        message: 'Seção não encontrada'
      });
    }

    // Se estiver alterando o capítulo, verificar se ele existe
    if (id_capitulo && id_capitulo !== secao.id_capitulo) {
      const capitulo = await CapituloModel.findByPk(id_capitulo);
      if (!capitulo) {
        return res.status(404).json({
          success: false,
          message: 'Capítulo não encontrado'
        });
      }
    }

    await secao.update({
      prompt: prompt || secao.prompt,
      titulo: titulo !== undefined ? titulo : secao.titulo,
      resumo: resumo !== undefined ? resumo : secao.resumo,
      ordem: ordem || secao.ordem,
      original: original !== undefined ? original : secao.original,
      link3d: link3d !== undefined ? link3d : secao.link3d,
      feedback: feedback !== undefined ? feedback : secao.feedback,
      ordem3d: ordem3d !== undefined ? ordem3d : secao.ordem3d,
      id_capitulo: id_capitulo || secao.id_capitulo
    });

    const secaoAtualizada = await SecaoModel.findByPk(id, {
      include: [
        {
          model: CapituloModel,
          as: 'capitulo',
          attributes: ['id', 'nome']
        },
        {
          model: ImagemModel,
          as: 'imagens',
          attributes: ['id', 'conteudo', 'descricao', 'content_type', 'ordem']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: secaoAtualizada,
      message: 'Seção atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar seção:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE - Deletar seção
const deleteSecao = async (req, res) => {
  try {
    const { id } = req.params;

    const secao = await SecaoModel.findByPk(id);
    if (!secao) {
      return res.status(404).json({
        success: false,
        message: 'Seção não encontrada'
      });
    }

    // Verificar se há imagens associadas e excluí-las
    const imagens = await ImagemModel.findAll({
      where: { id_secao: id }
    });

    if (imagens.length > 0) {
      // Excluir todas as imagens associadas à seção
      await ImagemModel.destroy({
        where: { id_secao: id }
      });
    }

    await secao.destroy();

    res.status(200).json({
      success: true,
      message: `Seção deletada com sucesso${imagens.length > 0 ? ` (${imagens.length} imagem(ns) também foram excluída(s))` : ''}`
    });
  } catch (error) {
    console.error('Erro ao deletar seção:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const salvarSecoesComoRascunho = async (req, res) => {
  try {
    const { id_capitulo_original, secoes, id_usuario } = req.body;

    // Validações básicas
    if (!id_capitulo_original || !id_usuario || !Array.isArray(secoes)) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: id_capitulo_original, id_usuario e secoes (array)'
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

    // Verificar se o usuário existe
    const usuario = await UsuariosModel.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    let rascunho;

    // Verificar se já existe um rascunho deste usuário para este capítulo
    const rascunhoExistente = await CapituloModel.findOne({
      where: {
        id_usuario,
        id_capitulo_original
      }
    });

    if (rascunhoExistente) {
      rascunho = rascunhoExistente;
      
      // Excluir seções e imagens existentes do rascunho
      const secoesExistentes = await SecaoModel.findAll({
        where: { id_capitulo: rascunho.id }
      });

      if (secoesExistentes.length > 0) {
        const idsSecoes = secoesExistentes.map(s => s.id);
        
        // Excluir imagens das seções
        await ImagemModel.destroy({
          where: { id_secao: idsSecoes }
        });

        // Excluir seções
        await SecaoModel.destroy({
          where: { id_capitulo: rascunho.id }
        });
      }
    } else {
      // Criar novo rascunho
      rascunho = await CapituloModel.create({
        nome: `Rascunho - ${capituloOriginal.nome}`,
        id_livro: capituloOriginal.id_livro,
        id_usuario,
        id_capitulo_original
      });
    }

    // Salvar seções no rascunho
    const secoesRascunho = [];
    
    for (const secaoData of secoes) {
      // Criar a seção
      const novaSecao = await SecaoModel.create({
        prompt: secaoData.prompt || null,
        titulo: secaoData.titulo || null,
        resumo: secaoData.resumo || null,
        ordem: secaoData.ordem,
        original: secaoData.original || null,
        link3d: secaoData.link3d || null,
        feedback: secaoData.feedback !== undefined ? secaoData.feedback : false,
        ordem3d: secaoData.ordem3d || null,
        id_capitulo: rascunho.id
      });

      // Salvar imagens da seção (se houver)
      if (secaoData.imagens && Array.isArray(secaoData.imagens)) {
        for (let i = 0; i < secaoData.imagens.length; i++) {
          const imagemData = secaoData.imagens[i];
          await ImagemModel.create({
            conteudo: imagemData.conteudo,
            descricao: imagemData.descricao || null,
            content_type: imagemData.content_type,
            ordem: imagemData.ordem || (i + 1),
            id_secao: novaSecao.id
          });
        }
      }

      secoesRascunho.push(novaSecao);
    }

    // Atualizar timestamp do rascunho se for um update
    if (rascunhoExistente) {
      await rascunho.update({ 
        nome: `Rascunho - ${capituloOriginal.nome}` 
      });
    }

    res.status(201).json({
      success: true,
      data: {
        rascunho,
        secoes: secoesRascunho
      },
      message: `Rascunho ${rascunhoExistente ? 'atualizado' : 'criado'} com sucesso`
    });
  } catch (error) {
    console.error('Erro ao salvar rascunho:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getSecoes,
  getSecaoById,
  createSecao,
  updateSecao,
  deleteSecao,
  salvarSecoesComoRascunho
};
