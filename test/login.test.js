const request = require('supertest');
const {expect} = require('chai');
// const app = require('../server');

describe('Login', () => {
   describe('POST /api/login', () => {
        it("ao usar credenciais válidas com um token em string, deve retornar 200", async () => {
            const response = await request('http://localhost:3000')
              .post('/api/login')
              .set('Content-Type', 'application/json')
              .send({
                'username': 'julio.lima',
                'password': '123456'
              })
              expect(response.status).to.equal(200);
              expect(response.body.token).to.be.a('string');
        })
    })
})