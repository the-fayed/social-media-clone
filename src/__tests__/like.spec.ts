import supertest from 'supertest';
import app from './../core/app';

const userData = {
  "email": "usaer@user.com",
  "password": "123456789"
};

const server = supertest(app);

describe('Like Tests', () => {
  let userToken: string | undefined;
  beforeAll(async () => {
    const res = await server.post('/api/v1/auth/login').send(userData);
    userToken = res.body.accessToken;
  });

  describe('POST /api/v1/posts/:postId/likes', () => {
    it('should like or dislike post with givin id', async () => {
      const res = await server.post('/api/v1/posts/6/likes').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200)
      expect(res.body.status).toEqual('success');
    });
  });

  describe('GET /api/v1/posts/:postId/likes', () => {
    it('should get a list of likes on a post with givin id', async () => {
      const res = await server.get('/api/v1/posts/3/likes').set('Authorization', `Bearer ${userToken}`);
      expect(res.body.status).toEqual('success');
      expect(res.status).toBe(200);
    })
  });

  describe('GET /api/v1/posts/postId/likes', () => {
    it('should give a 404 not found status on posts with no likes', async () => {
      const res = await server.get('/api/v1/posts/1/likes').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(404);
      expect(res.body.status).toEqual('Fail');
    })
  })
})