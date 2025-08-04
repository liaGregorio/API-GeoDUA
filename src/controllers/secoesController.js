const { SecaoModel, CapituloModel, ImagemModel } = require('../models');

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

module.exports = {
  getSecoes,
  getSecaoById,
  createSecao,
  updateSecao,
  deleteSecao
};
