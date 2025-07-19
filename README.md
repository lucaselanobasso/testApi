# Login API

Uma API REST simples de login desenvolvida em JavaScript com Express para estudos de teste de software.

## 🎯 Objetivo

Esta API foi criada especificamente para estudos de teste de software, incluindo cenários de:
- Login com sucesso
- Login inválido
- Bloqueio de conta após 3 tentativas falhadas
- Recuperação de senha ("Esqueci minha senha")

## 🚀 Funcionalidades

### ✅ Login
- Autenticação com username e senha
- Validação de formato de email
- Geração de token de acesso
- Controle de tentativas de login

### 🔒 Bloqueio de Conta
- Após 3 tentativas falhadas, a conta é bloqueada
- Status HTTP 423 (Locked) para contas bloqueadas
- Desbloqueio automático ao usar "Esqueci minha senha"

### 📧 Recuperação de Senha
- Endpoint para solicitar redefinição de senha
- Desbloqueia automaticamente a conta
- Simulação de envio de email

### 🧪 Endpoint para Testes
- Reset de tentativas de login para facilitar testes

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🛠️ Instalação

1. Clone ou baixe o projeto
2. Instale as dependências:

```bash
npm install
```

## 🏃‍♂️ Como Executar

### Desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Produção
```bash
npm start
```

O servidor estará disponível em: `http://localhost:3000`

## 📚 Documentação da API

### Swagger UI
Acesse a documentação interativa da API em:
```
http://localhost:3000/api-docs
```

### Endpoints Disponíveis

#### 1. Login
- **URL:** `POST /api/login`
- **Body:**
```json
{
  "username": "marcelo.salmeron",
  "password": "123456"
}
```

#### 2. Esqueci Minha Senha
- **URL:** `POST /api/forgot-password`
- **Body:**
```json
{
  "email": "usuario@teste.com"
}
```

#### 3. Reset de Tentativas (para testes)
- **URL:** `POST /api/reset-attempts`
- **Body:**
```json
{
  "email": "usuario@teste.com"
}
```

## 👥 Usuários de Teste

A API vem com dois usuários pré-configurados:

| Email | Senha | Nome |
|-------|-------|------|
| `usuario@teste.com` | `senha123` | Usuário Teste |
| `admin@teste.com` | `admin123` | Administrador |

## 🔄 Fluxo de Funcionamento

### Login Bem-sucedido
1. Envie email e senha válidos
2. Receba token de acesso
3. Contador de tentativas é resetado

### Login Falhado
1. Envie credenciais inválidas
2. Receba mensagem de erro
3. Contador de tentativas é incrementado
4. Após 3 tentativas, conta é bloqueada

### Conta Bloqueada
1. Tentativas de login retornam status 423
2. Use "Esqueci minha senha" para desbloquear
3. Conta é automaticamente desbloqueada

## 📊 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 400 | Dados inválidos |
| 401 | Credenciais inválidas |
| 404 | Usuário não encontrado |
| 423 | Conta bloqueada |
| 500 | Erro interno do servidor |

## 🧪 Cenários de Teste

### Teste 1: Login Válido
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@teste.com", "password": "senha123"}'
```

### Teste 2: Login Inválido
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@teste.com", "password": "senhaerrada"}'
```

### Teste 3: Bloqueio de Conta
Execute o teste 2 três vezes consecutivas para bloquear a conta.

### Teste 4: Esqueci Minha Senha
```bash
curl -X POST http://localhost:3000/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@teste.com"}'
```

### Teste 5: Reset de Tentativas
```bash
curl -X POST http://localhost:3000/api/reset-attempts \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@teste.com"}'
```

## 🏗️ Estrutura do Projeto

```
testApi/
├── server.js              # Servidor principal
├── package.json           # Dependências e scripts
├── README.md             # Documentação
├── routes/
│   └── loginRoutes.js    # Rotas da API
└── controllers/
    └── loginController.js # Lógica de negócio
```

## 🔧 Tecnologias Utilizadas

- **Express.js** - Framework web
- **Swagger UI Express** - Documentação da API
- **Swagger JSDoc** - Geração de documentação
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Segurança HTTP
- **Express Rate Limit** - Limitação de taxa

## 📝 Notas Importantes

- **Dados em Memória:** Todos os dados são armazenados em memória (variáveis/constantes)
- **Sem Banco de Dados:** Não há persistência de dados
- **Fins Educacionais:** API criada especificamente para estudos de teste
- **Tokens Simples:** Tokens gerados são simulados (não são JWT reais)

## 🤝 Contribuição

Este projeto é para fins educacionais. Sinta-se à vontade para usar como base para seus estudos de teste de software.

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes. 