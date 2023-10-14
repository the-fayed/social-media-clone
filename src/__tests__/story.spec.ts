import supertest from "supertest";
import app from "./../core/app";

const userData = {
  "email": "usaer@user.com",
  "password": "123456789",
};


const updatedPrivacy = {
  "privacy": "public"
}

const server = supertest(app);

describe("Story test", () => {
  let userToken: string | undefined;
  beforeAll(async () => {
    const res = await server.post("/api/v1/auth/login").send(userData);
    userToken = res.body.accessToken;
  });

  describe("GET /api/v1/stories", () => {
    it("should get a list of stroirs", async () => {
      const res = await server.get('/api/v1/stories').set('Authorization', `Bearer ${userToken}`);
      expect(res.body.status).toEqual('success');
      expect(res.status).toBe(200);
    });

    it('should not get any if user not logged in', async () => {
      const res = await server.get('/api/v1/stories');
      expect(res.body.status).toEqual('Fail');
      expect(res.status).toBe(401)
    })
  });

    describe("GET /api/v1/stories/loggedUser", () => {
    it("should get a list of stroirs of logged user", async () => {
      const res = await server.get('/api/v1/stories').set('Authorization', `Bearer ${userToken}`);
      expect(res.body.status).toEqual('success');
      expect(res.status).toBe(200);
    })
  })


  describe('GET /api/v1/stories/:id', () => {
    it('should get specific story with givin id', async () => {
      const res = await server.get('/api/v1/stories/1').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual('success');
    });

    it('should not get any if user is not logged in', async () => {
      const res = await server.get('/api/v1/stories/1');
      expect(res.body.status).toEqual('Fail');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/v1/stories/:id', () => {
    it('should update story privacy', async () => {
      const res = await server.put('/api/v1/stories/8').set('Authorization', `Bearer ${userToken}`).send(updatedPrivacy);
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual('success');
    })

    it('should not update nun if this is not the story owner', async () => {
      const res = await server.put('/api/v1/stories/1').set('Authorization', `Bearer ${userToken}`).send(updatedPrivacy);
      expect(res.status).toBe(409)
    });

    it('should update nun if user is not logged in', async () => {
      const res = await server.put('/api/v1/stories/1');
      expect(res.status).toBe(401);
      expect(res.body.status).toEqual('Fail');
    })
  });

  describe('DELETE /api/v1/stories/:id', () => {
    it('should delete a specific story with givin id', async() => {
      const res = await server.delete('/api/v1/stories/8').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual('success');
    });

    it('should delete nun if logged user is not the story author', async () => {
      const res = await server.delete('/api/v1/stories/1').set('Authoriztion', `Bearer ${userToken}`);
      expect(res.status).toBe(401);
    })

    it('it should delete nun if user is not logged in', async () => {
      const res = await server.delete('/api/v1/stories/8');
      expect(res.status).toBe(401);
      expect(res.body.status).toEqual('Fail');
    })
  })
})
