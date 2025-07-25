const request = require('supertest');
const { expect } = require('chai');

describe('Login', () => {
  context('POST /api/login', () => {
    it("ao usar credenciais válidas com um token em string, deve retornar 200 e fazer login com sucesso", async () => {
      const response = await request('http://localhost:3001')
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          'username': 'marcelo.salmeron',
          'password': '123456'
        })
      expect(response.status).to.equal(200);
      expect(response.body.token).to.be.a('string');
    })
    it("ao usar credenciais inválidas com um token em string, deve retornar 401 ou 423 se bloqueado", async () => {
      const response = await request('http://localhost:3001')
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          'username': 'Administrador',
          'password': 'senhaerrada'
        })
      expect([401, 423]).to.include(response.status);
    })
    it("ao realizar 3 tentativas, deve retornar 423 com o bloqueio da senha", async () => {
      const url = 'http://localhost:3001'
      const loginPayload = {
        'username': 'admin',
        'password': 'senhaerrada'
      }
      const tentarLogin = async () => {
        return await request(url)
          .post('/api/login')
          .set('Content-Type', 'application/json')
          .send(loginPayload)
      }

      const res1 = await tentarLogin();
      expect([401, 423]).to.include(res1.status);

      const res2 = await tentarLogin();
      expect([401, 423]).to.include(res2.status);

      const res3 = await tentarLogin();
      expect(res3.status).to.equal(423);

      const res4 = await tentarLogin();
      expect(res4.status).to.equal(423);
    })
    it("Esqueci minha senha - deve retornar 200 e mensagem de sucesso ao enviar e-mail válido", async () => {
      const response = await request('http://localhost:3001')
        .post('/api/forgot-password')
        .set('Content-Type', 'application/json')
        .send({
          email: 'usuario@teste.com'
        });
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('success').that.is.a('boolean');
      expect(response.body).to.have.property('message').that.is.a('string');
      expect(response.body.success).to.be.true;
      expect(response.body.message).to.match(/email.*enviado/i);
    });
    it("Esqueci minha senha - deve retornar 400 ao enviar e-mail inválido", async () => {
      const response = await request('http://localhost:3001')
        .post('/api/forgot-password')
        .set('Content-Type', 'application/json')
        .send({
          email: 'emailinvalido'
        });
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('success').that.is.a('boolean');
      expect(response.body).to.have.property('message').that.is.a('string');
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.match(/email.*inválido/i);
    });
  })
})