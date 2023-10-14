import supertest from "supertest";
import app from "./../core/app";

const seconds = 1000;
jest.setTimeout(70 * seconds);

const userData = {
  email: "usaer@user.com",
  password: "123456789",
};

const postData = {
  desc: "test post",
  privacy: "public",
};


const server = supertest(app);

describe("Post tests", () => {
  let userToken: string | undefined;
  beforeAll(async () => {
    const res = await server.post("/api/v1/auth/login").send(userData);
    userToken = res.body.accessToken;
  });

  describe("GET /api/v1/posts/loggedUser", () => {
    it("should get logged user posts", async () => {
      const res = await server.get("/api/v1/posts/loggedUser").set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual("success");
    });
  });

  describe("POST /api/v1/posts", () => {
    it("Should create a post", async () => {
      const res = await server.post("/api/v1/posts").set("Authorization", `Bearer ${userToken}`).send(postData);
      expect(res.body.status).toEqual("success");
      expect(res.status).toBe(201);
    });
  });

  describe("PUT /api/v1/posts/:id", () => {
    it("Should update the post with given id", async () => {
      const res = await server.put(`/api/v1/posts/1`).set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toEqual('success');
    });
  });

  describe('DELETE /api/v1/posts/:id', () => {
    it('should delete post', async() => {
      const res = await server.delete('/api/v1/posts/1').set('Authorization', `Bearer ${userToken}`);
      expect(res.body.status).toEqual('success');
      expect(res.status).toBe(200);
    })
  })
});
