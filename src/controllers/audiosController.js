const { AudioModel, CapituloModel } = require('../models');

/**
 * Função auxiliar para converter BLOB para base64
 */
const formatAudioResponse = (audio) => {
  if (!audio) return null;
  
  const audioData = audio.toJSON();
  
  // Converter Buffer/BLOB para base64 string
  if (audioData.conteudo) {
    if (Buffer.isBuffer(audioData.conteudo)) {
      audioData.conteudo = audioData.conteudo.toString('base64');
    } else if (audioData.conteudo.type === 'Buffer' && Array.isArray(audioData.conteudo.data)) {
      audioData.conteudo = Buffer.from(audioData.conteudo.data).toString('base64');
    }
  }
  
  return audioData;
};

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

    // Converter BLOBs para base64
    const audiosFormatados = audios.map(audio => formatAudioResponse(audio));

    res.status(200).json({
      success: true,
      data: audiosFormatados,
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

    const audioFormatado = formatAudioResponse(audio);

    res.status(200).json({
      success: true,
      data: audioFormatado,
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

    // Converter base64 para Buffer antes de salvar
    const audioBuffer = Buffer.from(conteudo, 'base64');

    const novoAudio = await AudioModel.create({
      conteudo: audioBuffer,
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

    const audioFormatado = formatAudioResponse(audioCriado);

    res.status(201).json({
      success: true,
      data: audioFormatado,
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

    // Preparar dados para atualização
    const updateData = {
      content_type: content_type || audio.content_type,
      id_capitulo: id_capitulo || audio.id_capitulo
    };

    // Se houver novo conteúdo, converter de base64 para Buffer
    if (conteudo) {
      updateData.conteudo = Buffer.from(conteudo, 'base64');
    }

    await audio.update(updateData);

    const audioAtualizado = await AudioModel.findByPk(id, {
      include: [
        {
          model: CapituloModel,
          as: 'capitulo',
          attributes: ['id', 'nome']
        }
      ]
    });

    const audioFormatado = formatAudioResponse(audioAtualizado);

    res.status(200).json({
      success: true,
      data: audioFormatado,
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