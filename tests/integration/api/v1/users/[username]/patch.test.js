import { version as uuidVersion } from "uuid";

import orchestrator from "tests/orchestrator";

import user from "models/user";
import password from "models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH to /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent 'username'", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/usuariosemcadastro",
        {
          method: "PATCH",
        },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O usuário informado sem cadastro.",
        action: "Informe corretamente username para realizar busca.",
        status_code: 404,
      });
    });

    test("With duplicated 'username'", async () => {
      await orchestrator.createUser({
        username: "username1",
      });

      await orchestrator.createUser({
        username: "username2",
      });

      const response = await fetch(
        "http://localhost:3000/api/v1/users/username2",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "username1",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O username informado já está cadastrado.",
        action: "Informe outro username para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With duplicated 'email'", async () => {
      await orchestrator.createUser({
        email: "user1@email.com.br",
      });

      const createUser2 = await orchestrator.createUser({
        email: "user2@email.com.br",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${createUser2.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "user1@email.com.br",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O email informado já está cadastrado.",
        action: "Informe outro email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With unique 'username'", async () => {
      const response1 = await orchestrator.createUser({
        username: "unique_username",
      });

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/${response1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "unique_usernameUpdate",
          }),
        },
      );

      expect(response2.status).toBe(200);

      const responseBody = await response2.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "unique_usernameUpdate",
        email: responseBody.email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      const versionUUID = 4;
      expect(uuidVersion(responseBody.id)).toBe(versionUUID);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With unique 'email'", async () => {
      const response1 = await orchestrator.createUser({
        email: "unique_email@email.com.br",
      });

      const emailUpdate = "unique_emailUpdate@email.com.br";

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/${response1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailUpdate,
          }),
        },
      );

      expect(response2.status).toBe(200);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        id: response2Body.id,
        username: response2Body.username,
        email: emailUpdate,
        password: response2Body.password,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      const versionUUID = 4;
      expect(uuidVersion(response2Body.id)).toBe(versionUUID);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
      expect(response2Body.updated_at > response2Body.created_at).toBe(true);
    });

    test("With new 'password'", async () => {
      const response1 = await orchestrator.createUser({
        password: "senha123",
      });

      const passwordNew = "newsenha123";

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/${response1.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: passwordNew,
          }),
        },
      );

      expect(response2.status).toBe(200);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        id: response2Body.id,
        username: response1.username,
        email: response1.email,
        password: response2Body.password,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      const versionUUID = 4;
      expect(uuidVersion(response2Body.id)).toBe(versionUUID);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
      expect(response2Body.updated_at > response2Body.created_at).toBe(true);

      const userInDatabase = await user.findOneByUserName(response1.username);
      const correctPasswordMatch = await password.compare(
        passwordNew,
        userInDatabase.password,
      );

      const incorrectPasswordMatch = await password.compare(
        response1.password,
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
