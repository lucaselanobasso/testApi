const request = require('supertest');
const { expect } = require('chai');
// const app = require('../server');

describe('Login', () => {
  describe('POST /api/login', () => {
    it("ao usar credenciais válidas com um token em string, deve retornar 200 e fazer login com sucesso", async () => {
      const response = await request('http://localhost:3000')
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          'username': 'marcelo.salmeron',
          'password': '123456'
        })
      expect(response.status).to.equal(200);
      expect(response.body.token).to.be.a('string');
    })
    it("ao usar credenciais inválidas com um token em string, deve retornar 401 e não fazer login", async () => {
      const response = await request('http://localhost:3000')
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
          'username': 'Administrador',
          'password': 'senhaerrada'
        })
      expect(response.status).to.equal(401);
    })
    it("ao realizar 3 tentativas, deve retornar 423 com o bloqueio da senha", async () => {
      const url = 'http://localhost:3000'
      const loginPayload = {
          'username': 'admin',
          'password': 'senhaerrada'
        }
      const tentarLogin = async () =>{
        return await request(url)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send(loginPayload)
      }

      const res1 = await tentarLogin();
      expect(res1.status).to.equal(401)

      const res2 = await tentarLogin();
      expect(res2.status).to.equal(401);

      const res3 = await tentarLogin();
      expect(res3.status).to.equal(423);

      const res4 = await tentarLogin();
      expect(res4.status).to.equal(423);
    })
  })
})