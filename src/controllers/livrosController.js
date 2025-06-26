const { LivroModel } = require('../models');

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

    // Deletar o livro
    await livro.destroy();

    res.status(200).json({
      success: true,
      message: 'Livro deletado com sucesso'
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
