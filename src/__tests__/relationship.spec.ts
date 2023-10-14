import supertest from 'supertest';
import app from './../core/app';

const userData = {
  "email": "usaer@user.com",
  "password": "123456789",
};

const user2Data = {
  "email": "test2@email.com",
  "password": "123456789"
}

const server = supertest(app);

describe('Relationship Test 1', () => {
  let userToken: string | undefined;
  beforeAll(async () => {
    const res = await server.post('/api/v1/auth/login').send(user2Data);
    userToken = res.body.accessToken;
  });

  describe('POST /api/v1/users/:userId/relationships', () => {
    it('should follow or un follow a user with givin id', async () => {
      const res = await server.post('/api/v1/users/3/relationships').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual('success');
    })
  });

  describe("POST /api/v1/users/:userId/relationships", () => {
    it("should give a 409 status code if the givin user id equal logged user id", async () => {
      const res = await server.post("/api/v1/users/2/relationships").set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/v1/loggedUser/followers', () => {
    it('should get list of logged user followers', async () => {
      const res = await server.get('/api/v1/relationships/loggedUser/followers').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual('success');
    })
  });

  describe("GET /api/v1/loggedUser/following", () => {
    it("should get logged user following list", async () => {
      const res = await server
        .get("/api/v1/relationships/loggedUser/following")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual("success");
    });
  });
});

describe('Relationships Test 2', () => {
  let userToken: string | undefined;
  beforeAll(async () => {
    const res = await server.post("/api/v1/auth/login").send(userData);
    userToken = res.body.accessToken;
  });

  describe("GET /api/v1/loggedUser/followers", () => {
    it("should give 404 not found status in case user have no followers list", async () => {
      const res = await server
        .get("/api/v1/relationships/loggedUser/followers")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(404);
      expect(res.body.status).toEqual("Fail");
    });
  });

  describe("GET /api/v1/loggedUser/following", () => {
    it("should give 404 not found status in case user have no following list", async () => {
      const res = await server
        .get("/api/v1/relationships/loggedUser/following")
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(404);
      expect(res.body.status).toEqual("Fail");
    });
  });
})