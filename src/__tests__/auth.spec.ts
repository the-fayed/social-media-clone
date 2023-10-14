import supertest from 'supertest';
import app from './../core/app';

const seconds = 1000;
jest.setTimeout(70 * seconds);

const userData = {
  "email": "usaer@user.com",
  "password": "123456789",
};

const newUserData = {
  "email": "notuser@gmail.com",
  "password": "123456789",
  "passwordConfirmation": "123456789",
  "name": "test user",
  "username": "test-user-3",
  "city": "Cairo",
  "website": "https://www.facebook.com/username"
}

const newUserWithUnverifiedEmail = {
  "email": "test@email.com",
  "password": "123456789"
}

const fakeData = {
  "email": "notregister@test.com",
  "password": "notPassword"
}

const server = supertest(app);

describe('auth tests', () => {
  describe('POST /api/v1/auth/login', () => {
    it("Should login user", async () => {
      const res = await server.post("/api/v1/auth/login").send(userData);
      expect(res.body.status).toEqual('success');
      expect(res.status).toBe(200)
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it("should prevent un register users from login", async () => {
      const res = await server.post('/api/v1/auth/login').send(fakeData);
      expect(res.status).toBe(409);
    })
  })

  describe('POST /api/v1/auth/login', () => {
    it("should prevent users with unverified email from login", async () => {
      const res = await server.post('/api/v1/auth/login').send(newUserWithUnverifiedEmail);
      expect(res.status).toBe(401);
    })
  })

  describe('POST /api/v1/auth/signup', () => {
    it('should sign up new user', async () => {
      const res = await server.post('/api/v1/auth/signup').send(newUserData);
      expect(res.body.status).toEqual('success');
      expect(res.status).toBe(201);
    })
  });
})