const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const loginRoutes = require('./routes/loginRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Login API',
      version: '1.0.0',
      description: 'API REST simples de login para estudos de teste de software',
      contact: {
        name: 'Test API',
        email: 'test@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      schemas: {
        LoginRequest: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Username do usuário'
            },
            password: {
              type: 'string',
              description: 'Senha do usuário'
            }
          },
          required: ['username', 'password']
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica se o login foi bem-sucedido'
            },
            message: {
              type: 'string',
              description: 'Mensagem de resposta'
            },
            token: {
              type: 'string',
              description: 'Token de autenticação (apenas em caso de sucesso)'
            },
            user: {
              type: 'object',
              properties: {
                username: {
                  type: 'string',
                  description: 'Username do usuário'
                },
                name: {
                  type: 'string',
                  description: 'Nome do usuário'
                }
              }
            },
            attemptsLeft: {
              type: 'number',
              description: 'Tentativas restantes antes do bloqueio'
            }
          }
        },
        ForgotPasswordRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário para recuperação de senha'
            }
          },
          required: ['email']
        },
        ForgotPasswordResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica se a solicitação foi processada'
            },
            message: {
              type: 'string',
              description: 'Mensagem de resposta'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware de segurança
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: {
    error: 'Muitas requisições deste IP, tente novamente mais tarde.'
  }
});
app.use(limiter);

// Middleware para parsing JSON com tratamento de erro
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({
        success: false,
        message: 'JSON inválido'
      });
      throw new Error('JSON inválido');
    }
  }
}));

// Middleware para tratar erros de parsing JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido'
    });
  }
  next();
});

// Rota do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API
app.use('/api', loginRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: 'Login API está funcionando!',
    swagger: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      login: 'POST /api/login',
      forgotPassword: 'POST /api/forgot-password',
      resetAttempts: 'POST /api/reset-attempts'
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Swagger disponível em: http://localhost:${PORT}/api-docs`);
  console.log(`🌐 API base URL: http://localhost:${PORT}/api`);
}); 