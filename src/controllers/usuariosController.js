const sequelize = require('../config/database');
const { UsuariosModel, UsuariosTiposModel } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Obter todos os usuários
const getAllUsuarios = async (req, res, next) => {
  try {
    const usuarios = await UsuariosModel.findAll({
      attributes: { exclude: ['senha'] }, // Não retorna as senhas
      include: [
        {
          model: UsuariosTiposModel,
          as: 'tipoUsuario',
          attributes: ['id', 'nome']
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: usuarios.length,
      data: usuarios
    });
  } catch (error) {
    next(error);
  }
};

// Obter um usuário pelo ID
const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const usuario = await UsuariosModel.findByPk(id, {
      attributes: { exclude: ['senha'] },
      include: [
        {
          model: UsuariosTiposModel,
          as: 'tipoUsuario',
          attributes: ['id', 'nome']
        }
      ]
    });
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    next(error);
  }
};

// Registrar novo usuário
const registrarUsuario = async (req, res, next) => {
  try {
    const { nome, email, senha, id_usuarios_tipos } = req.body;

    // Validar se todos os campos obrigatórios foram fornecidos
    if (!nome || !email || !senha || !id_usuarios_tipos) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios: nome, email, senha e tipo de usuário'
      });
    }

    // Validar se o tipo de usuário é válido (apenas 2 ou 3)
    if (![2, 3].includes(parseInt(id_usuarios_tipos))) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de usuário inválido. Apenas alunos ou professores são permitidos para registro.'
      });
    }

    // Verificar se o email já existe
    const usuarioExistente = await UsuariosModel.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }

    // Criptografar a senha
    const saltRounds = 10;
    const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

    // Criar o usuário
    const novoUsuario = await UsuariosModel.create({
      nome,
      email,
      senha: senhaCriptografada,
      id_usuarios_tipos: parseInt(id_usuarios_tipos)
    });

    // Buscar o usuário criado com as informações do tipo
    const usuarioCriado = await UsuariosModel.findByPk(novoUsuario.id, {
      attributes: { exclude: ['senha'] },
      include: [
        {
          model: UsuariosTiposModel,
          as: 'tipoUsuario',
          attributes: ['id', 'nome']
        }
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: usuarioCriado
    });

  } catch (error) {
    next(error);
  }
};

// Login de usuário
const loginUsuario = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    // Validar se email e senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar o usuário pelo email
    const usuario = await UsuariosModel.findOne({ 
      where: { email },
      include: [
        {
          model: UsuariosTiposModel,
          as: 'tipoUsuario',
          attributes: ['id', 'nome']
        }
      ]
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        tipoUsuario: usuario.id_usuarios_tipos 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar dados do usuário (sem a senha) e token
    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipoUsuario: usuario.tipoUsuario
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Obter perfil do usuário logado
const getPerfilUsuario = async (req, res, next) => {
  try {
    // O usuário já está disponível em req.user através do middleware authenticateToken
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

// Autenticação com Google
const googleAuth = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token do Google é obrigatório'
      });
    }

    // Verificar o token com o Google
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Buscar ou criar usuário no banco de dados
    let usuario = await UsuariosModel.findOne({ 
      where: { email: payload.email },
      include: [
        {
          model: UsuariosTiposModel,
          as: 'tipoUsuario',
          attributes: ['id', 'nome']
        }
      ]
    });

    // Se o usuário não existe, criar um novo com tipo "aluno" (id: 3)
    if (!usuario) {
      const novoUsuario = await UsuariosModel.create({
        nome: payload.name,
        email: payload.email,
        senha: null, // Usuários do Google não têm senha local
        id_usuarios_tipos: 3, // Tipo "aluno" por padrão
        google_id: payload.sub // ID único do Google
      });

      usuario = await UsuariosModel.findByPk(novoUsuario.id, {
        include: [
          {
            model: UsuariosTiposModel,
            as: 'tipoUsuario',
            attributes: ['id', 'nome']
          }
        ]
      });
    }

    // Gerar JWT token para a aplicação
    const jwtToken = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        tipoUsuario: usuario.id_usuarios_tipos 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Autenticação com Google realizada com sucesso',
      data: {
        token: jwtToken,
        user: {
          id: usuario.id,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          tipoUsuario: usuario.tipoUsuario
        }
      }
    });

  } catch (error) {
    console.error('Erro na autenticação Google:', error);
    return res.status(400).json({
      success: false,
      message: 'Token inválido ou erro na autenticação'
    });
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  registrarUsuario,
  loginUsuario,
  getPerfilUsuario,
  googleAuth
};