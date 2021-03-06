const app = require('../index') // Link to your server file
const supertest = require('supertest')
const bcrypt = require('bcrypt');
const request = supertest(app)


describe('user router connection', () => {
  it('should connect to user router', async () => {
    const response = await request.get("/api/user/");
    expect(response.statusCode).toBe(200);
  })
})

describe('test register user', () => {
  it('should register a new user with hashed password', async () => {
    let isItHashed = false;
    const testUser = {
      username: 'eleanor',
      password: '123456'
    }
    try {
      const result = await request.post('/api/user/register').send(testUser);
      console.log(result.body)
      let passwordDB = result.body;
      let passwordInput = testUser.password;
      bcrypt.compare(passwordInput, passwordDB, (err, result) => {
        if(result) {
          isItHashed = true;
        }
        else {
          console.log('no good');
        }
      })
      expect(isItHashed).toBe(true);
    } catch (err) {
      console.log('error in user register test', err)
    }
  })
})