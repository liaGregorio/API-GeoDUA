const { AudioModel, CapituloModel } = require('../models');

// GET - Listar áudios de um capítulo específico
const getAudios = async (req, res) => {
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

    const audios = await AudioModel.findAll({
      where: { id_capitulo: idCapitulo },
      include: [
        {
          model: CapituloModel,
          as: 'capitulo',
          attributes: ['id', 'nome']
        }
      ],
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: audios,
      message: 'Áudios listados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar áudios:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET - Buscar áudio por ID
const getAudioById = async (req, res) => {
  try {
    const { id } = req.params;

    const audio = await AudioModel.findByPk(id, {
      include: [
        {
          model: CapituloModel,
          as: 'capitulo',
          attributes: ['id', 'nome']
        }
      ]
    });

    if (!audio) {
      return res.status(404).json({
        success: false,
        message: 'Áudio não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: audio,
      message: 'Áudio encontrado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar áudio:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST - Criar novo áudio
const createAudio = async (req, res) => {
  try {
    const { conteudo, content_type, id_capitulo } = req.body;

    // Validações obrigatórias
    if (!conteudo || !content_type || !id_capitulo) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: conteudo, content_type e id_capitulo'
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

    const novoAudio = await AudioModel.create({
      conteudo,
      content_type,
      id_capitulo
    });

    const audioCriado = await AudioModel.findByPk(novoAudio.id, {
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
      data: audioCriado,
      message: 'Áudio criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar áudio:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT - Atualizar áudio
const updateAudio = async (req, res) => {
  try {
    const { id } = req.params;
    const { conteudo, content_type, id_capitulo } = req.body;

    const audio = await AudioModel.findByPk(id);
    if (!audio) {
      return res.status(404).json({
        success: false,
        message: 'Áudio não encontrado'
      });
    }

    // Se estiver alterando o capítulo, verificar se ele existe
    if (id_capitulo && id_capitulo !== audio.id_capitulo) {
      const capitulo = await CapituloModel.findByPk(id_capitulo);
      if (!capitulo) {
        return res.status(404).json({
          success: false,
          message: 'Capítulo não encontrado'
        });
      }
    }

    await audio.update({
      conteudo: conteudo || audio.conteudo,
      content_type: content_type || audio.content_type,
      id_capitulo: id_capitulo || audio.id_capitulo
    });

    const audioAtualizado = await AudioModel.findByPk(id, {
      include: [
        {
          model: CapituloModel,
          as: 'capitulo',
          attributes: ['id', 'nome']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: audioAtualizado,
      message: 'Áudio atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar áudio:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE - Deletar áudio
const deleteAudio = async (req, res) => {
  try {
    const { id } = req.params;

    const audio = await AudioModel.findByPk(id);
    if (!audio) {
      return res.status(404).json({
        success: false,
        message: 'Áudio não encontrado'
      });
    }

    await audio.destroy();

    res.status(200).json({
      success: true,
      message: 'Áudio deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar áudio:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAudios,
  getAudioById,
  createAudio,
  updateAudio,
  deleteAudio
};
