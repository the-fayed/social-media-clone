import supertest from "supertest";
import app from "./../core/app";

const seconds = 1000;
jest.setTimeout(70 * seconds);

const adminData = {
  "email": "admin@admin.com",
  "password": "123456789",
};

const userData = {
  "email": "notuser@yahoo.com",
  "password": "123456789"
}

const newUserData = {
  "email": "email@email.com",
  "password": "123456789",
  "passwordConfirmation": "123456789",
  "username": "new-user-test",
  "name": "user test",
  "city": "Cairo",
  "role": "Admin", //* just for test
};

const updateData = {
  "name": "not-admin",
};

const updatePassword = {
  "password": "new-password-test",
  "passwordConfirmation": "new-password-test"
}


const server = supertest(app);

describe("User tests for admin roles", () => {
  // Admin login to test his endpoints;
  let adminToken: string | undefined;
  beforeAll(async () => {
    const res = await server.post("/api/v1/auth/login").send(adminData);
    adminToken = res.body.accessToken;
  });


  describe("POST /api/v1/users", () => {
    it("should create new user", async () => {
      const res = await server.post("/api/v1/users").send(newUserData).set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(201);
      expect(res.body.status).toEqual("success");
    });
  });

  describe("PUT /api/v1/users/update/loggedUserData", () => {
    it("update logged user data", async () => {
      const res = await server
        .put("/api/v1/users/update/loggedUserData")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData);
      expect(res.body.status).toEqual("success");
      expect(res.status).toBe(200);
    });
  });

  describe("PUT /api/v1/users/update/loggedUserPassword", () => {
    it("update logged user data", async () => {
      const res = await server
        .put("/api/v1/users/update/loggedUserPassword")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatePassword);
      expect(res.body.status).toEqual("success");
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /api/v1/users/id", () => {
    it('should delete specific user only allowed to admin', async () => {
      const res = await server.delete(`/api/v1/users/13`).set('Authorization', `Bearer ${adminToken}`);
      expect(res.body.status).toEqual('success');
      expect(res.status).toBe(200);
    })
  })
});

describe('User tests for users roles', () => {
  let userToken: string | undefined;
  beforeAll(async () => {
    const res = await server.post('/api/v1/auth/login').send(userData);
    userToken = res.body.accessToken;
  })

  describe("POST /api/v1/users", () => {
    it("should create new user", async () => {
      const res = await server.post("/api/v1/users").send(newUserData).set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/v1/users/update/loggedUserData", () => {
    it("update logged user data", async () => {
      const res = await server
        .put("/api/v1/users/update/loggedUserData")
        .set("Authorization", `Bearer ${userToken}`)
        .send(updateData);
      expect(res.body.status).toEqual("success");
      expect(res.status).toBe(200);
    });
  });

  describe("PUT /api/v1/users/update/loggedUserPassword", () => {
    it("update logged user data", async () => {
      const res = await server
        .put("/api/v1/users/update/loggedUserPassword")
        .set("Authorization", `Bearer ${userToken}`)
        .send(updatePassword);
      expect(res.body.status).toEqual("success");
      expect(res.status).toBe(200);
    });
  });

    describe("DELETE /api/v1/users/deleteLoggedUser", () => {
      it("Should delete logged user", async () => {
        const res = await server.delete("/api/v1/users/deleteLoggedUser").set("Authorization", `Bearer ${userToken}`);
        expect(res.body.status).toEqual("success");
        expect(res.status).toBe(200);
      });
    });

  describe("DELETE /api/v1/users/id", () => {
    it("should delete specific user only allowed to admin", async () => {
      const res = await server.delete(`/api/v1/users/13`).set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(401);
    });
  });
})

