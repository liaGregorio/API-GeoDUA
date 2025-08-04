const { ImagemModel, SecaoModel } = require('../models');

// GET - Listar imagens de uma seção específica
const getImagens = async (req, res) => {
  try {
    const { idSecao } = req.params;

    // Verificar se a seção existe
    const secao = await SecaoModel.findByPk(idSecao);
    if (!secao) {
      return res.status(404).json({
        success: false,
        message: 'Seção não encontrada'
      });
    }

    const imagens = await ImagemModel.findAll({
      where: { id_secao: idSecao },
      include: [
        {
          model: SecaoModel,
          as: 'secao',
          attributes: ['id', 'prompt', 'ordem']
        }
      ],
      order: [['ordem', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: imagens,
      message: 'Imagens listadas com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET - Buscar imagem por ID
const getImagemById = async (req, res) => {
  try {
    const { id } = req.params;

    const imagem = await ImagemModel.findByPk(id, {
      include: [
        {
          model: SecaoModel,
          as: 'secao',
          attributes: ['id', 'prompt', 'ordem']
        }
      ]
    });

    if (!imagem) {
      return res.status(404).json({
        success: false,
        message: 'Imagem não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: imagem,
      message: 'Imagem encontrada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST - Criar nova imagem
const createImagem = async (req, res) => {
  try {
    const { conteudo, descricao, content_type, ordem, id_secao } = req.body;

    // Validações obrigatórias
    if (!conteudo || !content_type || !ordem || !id_secao) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: conteudo, content_type, ordem e id_secao'
      });
    }

    // Verificar se a seção existe
    const secao = await SecaoModel.findByPk(id_secao);
    if (!secao) {
      return res.status(404).json({
        success: false,
        message: 'Seção não encontrada'
      });
    }

    // Verificar se já existe uma imagem com a mesma ordem na seção
    const imagemExistente = await ImagemModel.findOne({
      where: { id_secao, ordem }
    });

    if (imagemExistente) {
      return res.status(400).json({
        success: false,
        message: 'Já existe uma imagem com esta ordem nesta seção'
      });
    }

    const novaImagem = await ImagemModel.create({
      conteudo,
      descricao,
      content_type,
      ordem,
      id_secao
    });

    const imagemCriada = await ImagemModel.findByPk(novaImagem.id, {
      include: [
        {
          model: SecaoModel,
          as: 'secao',
          attributes: ['id', 'prompt', 'ordem']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: imagemCriada,
      message: 'Imagem criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar imagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT - Atualizar imagem
const updateImagem = async (req, res) => {
  try {
    const { id } = req.params;
    const { conteudo, descricao, content_type, ordem, id_secao } = req.body;

    const imagem = await ImagemModel.findByPk(id);
    if (!imagem) {
      return res.status(404).json({
        success: false,
        message: 'Imagem não encontrada'
      });
    }

    await imagem.update({
      conteudo: conteudo || imagem.conteudo,
      descricao: descricao !== undefined ? descricao : imagem.descricao,
      content_type: content_type || imagem.content_type,
      ordem: ordem || imagem.ordem,
      id_secao: id_secao || imagem.id_secao
    });

    const imagemAtualizada = await ImagemModel.findByPk(id, {
      include: [
        {
          model: SecaoModel,
          as: 'secao',
          attributes: ['id', 'prompt', 'ordem']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: imagemAtualizada,
      message: 'Imagem atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar imagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE - Deletar imagem
const deleteImagem = async (req, res) => {
  try {
    const { id } = req.params;

    const imagem = await ImagemModel.findByPk(id);
    if (!imagem) {
      return res.status(404).json({
        success: false,
        message: 'Imagem não encontrada'
      });
    }

    await imagem.destroy();

    res.status(200).json({
      success: true,
      message: 'Imagem deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getImagens,
  getImagemById,
  createImagem,
  updateImagem,
  deleteImagem
};
