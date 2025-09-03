const { LivroModel, CapituloModel, SecaoModel, ImagemModel, AudioModel } = require('../models');

// GET - Listar todos os livros
const getLivros = async (req, res) => {
  try {
    const livros = await LivroModel.findAll({
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: livros,
      message: 'Livros listados com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET - Buscar livro por ID
const getLivroById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const livro = await LivroModel.findByPk(id);
    
    if (!livro) {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: livro,
      message: 'Livro encontrado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST - Criar um novo livro
const createLivro = async (req, res) => {
  try {
    const { nome } = req.body;

    // Validação
    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Nome do livro é obrigatório'
      });
    }

    const novoLivro = await LivroModel.create({
      nome: nome.trim()
    });

    res.status(201).json({
      success: true,
      data: novoLivro,
      message: 'Livro criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT - Atualizar livro
const updateLivro = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    // Validação
    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Nome do livro é obrigatório'
      });
    }

    // Verificar se o livro existe
    const livro = await LivroModel.findByPk(id);
    if (!livro) {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }

    // Atualizar o livro
    await livro.update({
      nome: nome.trim()
    });

    res.status(200).json({
      success: true,
      data: livro,
      message: 'Livro atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE - Deletar livro
const deleteLivro = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o livro existe
    const livro = await LivroModel.findByPk(id);
    if (!livro) {
      return res.status(404).json({
        success: false,
        message: 'Livro não encontrado'
      });
    }

    // Buscar todos os capítulos do livro
    const capitulos = await CapituloModel.findAll({
      where: { id_livro: id }
    });

    let totalElementosExcluidos = {
      capitulos: 0,
      rascunhos: 0,
      secoes: 0,
      imagens: 0,
      audios: 0
    };

    // Para cada capítulo, executar a mesma lógica de exclusão em cascata
    for (const capitulo of capitulos) {
      // Buscar rascunhos que referenciam este capítulo
      const rascunhos = await CapituloModel.findAll({
        where: { id_capitulo_original: capitulo.id }
      });

      // Buscar seções que pertencem a este capítulo
      const secoes = await SecaoModel.findAll({
        where: { id_capitulo: capitulo.id }
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
      const idsCapitulosParaExcluir = [capitulo.id, ...rascunhos.map(r => r.id)];
      const audios = await AudioModel.findAll({
        where: { id_capitulo: idsCapitulosParaExcluir }
      });

      // Buscar e excluir imagens das seções
      let totalImagens = 0;
      if (todasSecoes.length > 0) {
        const idsSecoes = todasSecoes.map(s => s.id);
        
        // Contar imagens antes de excluir
        totalImagens = await ImagemModel.count({
          where: { id_secao: idsSecoes }
        });

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
          where: { id_capitulo_original: capitulo.id }
        });
      }

      // Atualizar contadores
      totalElementosExcluidos.rascunhos += rascunhos.length;
      totalElementosExcluidos.secoes += todasSecoes.length;
      totalElementosExcluidos.imagens += totalImagens;
      totalElementosExcluidos.audios += audios.length;
    }

    // Excluir todos os capítulos do livro
    if (capitulos.length > 0) {
      await CapituloModel.destroy({
        where: { id_livro: id }
      });
      totalElementosExcluidos.capitulos = capitulos.length;
    }

    // Deletar o livro
    await livro.destroy();

    // Preparar mensagem de resposta
    let mensagem = 'Livro deletado com sucesso';
    const detalhes = [];
    
    if (totalElementosExcluidos.capitulos > 0) {
      detalhes.push(`${totalElementosExcluidos.capitulos} capítulo(s)`);
    }
    if (totalElementosExcluidos.rascunhos > 0) {
      detalhes.push(`${totalElementosExcluidos.rascunhos} rascunho(s)`);
    }
    if (totalElementosExcluidos.secoes > 0) {
      detalhes.push(`${totalElementosExcluidos.secoes} seção(ões)`);
    }
    if (totalElementosExcluidos.imagens > 0) {
      detalhes.push(`${totalElementosExcluidos.imagens} imagem(ns)`);
    }
    if (totalElementosExcluidos.audios > 0) {
      detalhes.push(`${totalElementosExcluidos.audios} áudio(s)`);
    }
    
    if (detalhes.length > 0) {
      mensagem += ` (${detalhes.join(', ')} também foram excluído(s))`;
    }

    res.status(200).json({
      success: true,
      message: mensagem,
      totalExcluidos: totalElementosExcluidos
    });
  } catch (error) {
    console.error('Erro ao deletar livro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getLivros,
  getLivroById,
  createLivro,
  updateLivro,
  deleteLivro
};
