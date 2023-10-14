import supertest from 'supertest';
import app from './../core/app';

const seconds = 1000;
jest.setTimeout(70 * 1000);

const userData = {
  "email": "usaer@user.com",
  "password": "123456789"
};

const comment = {
  "desc": "new comment test"
}

const updatedComment = {
  "desc": "new-comment-updated-test"
}

const server = supertest(app);

describe('Comment Tests', () => {
  let userToken: string | undefined;
  beforeAll(async () => {
    const res = await server.post('/api/v1/auth/login').send(userData);
    userToken = res.body.accessToken;
  });

  describe('POST /api/v1/posts/:postId/comments', () => {
    it('should add comment to the post with givin id', async () => {
      const res = await server.post('/api/v1/posts/2/comments').set('Authorization', `Bearer ${userToken}`).send(comment);
      expect(res.status).toEqual(201);
      expect(res.body.status).toEqual('success');
    });
  });

  describe('GET /api/v1/posts/:postId/comments', () => {
    it('should get array of comments', async () => {
      const res = await server.get('/api/v1/posts/2/comments').set('Authorization', `Bearer ${userToken}`);
      expect(res.body.status).toEqual('success'),
      expect(res.status).toEqual(200);
    });
  });

    describe("GET /api/v1/posts/:postId/comments", () => {
      it("should give a 404 not found status on posts without comments", async () => {
        const res = await server.get("/api/v1/posts/1/comments").set("Authorization", `Bearer ${userToken}`);
        expect(res.body.status).toEqual("Fail");
        expect(res.status).toEqual(404);
      });
    });

  describe('GET /api/v1/comments/:id', () => {
    it('Should get a specific comment with givin id', async () => {
      const res = await server.get('/api/v1/comments/5').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200)
      expect(res.body.status).toEqual('success');
    })
  });

  describe('PUT /api/v1/comments/:id', () => {
    it('should update a specific comment with givin id', async () => {
      const res = await server.put('/api/v1/comments/4').set('Authorization', `Bearer ${userToken}`).send(updatedComment);
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual('success');
    })
  });

  describe('DELETE /api/v1/comments/:id', () => {
    it('should delete a specific comment with givin id', async () => {
      const res = await server.delete('/api/v1/comments/4').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual('success');
    })
  });
})