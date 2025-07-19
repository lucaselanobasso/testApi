// Dados em memória para simular um banco de dados
const users = [
  {
    username: 'usuario',
    password: 'senha123',
    name: 'Usuário Teste',
    email: 'usuario@teste.com'
  },
  {
    username: 'admin',
    password: 'admin123',
    name: 'Administrador',
    email: 'admin@teste.com'
  },
  {
    username: 'marcelo.salmeron',
    password: '123456',
    name: 'Marcelo Salmeron',
    email: 'marcelo.salmeron@teste.com'
  }
];

// Controle de tentativas de login por email
const loginAttempts = new Map();

// Tokens gerados (em produção, seria um JWT real)
const activeTokens = new Set();

/**
 * Gera um token simples para simulação
 * @returns {string} Token gerado
 */
function generateToken() {
  const token = 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  activeTokens.add(token);
  return token;
}

/**
 * Valida se um login tem formato válido
 * @param {string} login - Login a ser validado
 * @returns {boolean} True se válido, false caso contrário
 */
function isValidLogin(login) {
  // Aceita qualquer string não vazia como login
  return login && login.trim().length > 0;
}

/**
 * Valida se um email tem formato válido
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se válido, false caso contrário
 */
function isValidEmail(email) {
  // Regex simples para validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Realiza o login do usuário
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const login = (req, res) => {
  try {
    const { username, password } = req.body;

    // Validação dos campos obrigatórios
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username e senha são obrigatórios'
      });
    }

    // Validação do formato do username
    if (!isValidLogin(username)) {
      return res.status(400).json({
        success: false,
        message: 'Username inválido'
      });
    }

    // Verifica se a conta está bloqueada
    const attempts = loginAttempts.get(username) || 0;
    if (attempts >= 3) {
      return res.status(423).json({
        success: false,
        message: 'Conta bloqueada devido a múltiplas tentativas falhadas. Use "Esqueci minha senha" para desbloquear.'
      });
    }

    // Busca o usuário
    const user = users.find(u => u.username === username);

    // Verifica se o usuário existe e a senha está correta
    if (!user || user.password !== password) {
      // Incrementa o contador de tentativas
      const newAttempts = attempts + 1;
      loginAttempts.set(username, newAttempts);
      
      const attemptsLeft = 3 - newAttempts;
      
      if (attemptsLeft > 0) {
        return res.status(401).json({
          success: false,
          message: 'Username ou senha incorretos',
          attemptsLeft: attemptsLeft
        });
      } else {
        return res.status(423).json({
          success: false,
          message: 'Conta bloqueada devido a múltiplas tentativas falhadas. Use "Esqueci minha senha" para desbloquear.'
        });
      }
    }

    // Login bem-sucedido - reseta as tentativas
    loginAttempts.delete(username);
    
    // Gera token
    const token = generateToken();

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      token: token,
      user: {
        username: user.username,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Processa a solicitação de "Esqueci minha senha"
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const forgotPassword = (req, res) => {
  try {
    const { email } = req.body;

    // Validação do campo obrigatório
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório'
      });
    }

    // Validação do formato do email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Busca o usuário pelo email para obter o username correspondente
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Reseta as tentativas de login (desbloqueia a conta)
    // Agora usando o username do usuário encontrado pelo email
    loginAttempts.delete(user.username);

    // Em um cenário real, aqui seria enviado um email
    // Para fins de teste, apenas simulamos o envio
    console.log(`Email de recuperação enviado para: ${email}`);
    console.log(`Username correspondente: ${user.username}`);
    console.log(`Nova senha temporária: temp_${Math.random().toString(36).substr(2, 6)}`);

    return res.status(200).json({
      success: true,
      message: 'Email de recuperação enviado com sucesso. Verifique sua caixa de entrada.',
      username: user.username // Opcional: retornar o username para debug
    });

  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Reseta as tentativas de login para um usuário (endpoint para testes)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const resetAttempts = (req, res) => {
  try {
    const { email } = req.body;

    // Validação do campo obrigatório
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório'
      });
    }

    // Validação do formato do email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Busca o usuário
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Reseta as tentativas
    // As tentativas são armazenadas por username, então precisamos usar o username do usuário encontrado
    loginAttempts.delete(user.username);

    return res.status(200).json({
      success: true,
      message: 'Tentativas resetadas com sucesso'
    });

  } catch (error) {
    console.error('Erro ao resetar tentativas:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  login,
  forgotPassword,
  resetAttempts
}; 