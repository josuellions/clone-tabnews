import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";

import orchestrator from "tests/orchestrator";

import session from "models/session";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET to /api/v1/user", () => {
  describe("Default user", () => {
    test("With valid session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UserWithValidSession",
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      // Valida se cache navegador está desabilitado
      const cacheControl = response.headers.get("Cache-Control");

      expect(cacheControl).toBe(
        "no-store, no-cache, max-age=0, must-revalidate",
      );

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: createdUser.id,
        username: "UserWithValidSession",
        email: createdUser.email,
        password: createdUser.password,
        created_at: createdUser.created_at.toISOString(),
        updated_at: createdUser.updated_at.toISOString(),
      });

      const versionUUID = 4;
      expect(uuidVersion(responseBody.id)).toBe(versionUUID);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      // Session renewal assertions
      const renewedSessionObject = await session.findOneValidByToken(
        sessionObject.token,
      );

      expect(
        renewedSessionObject.expires_at > sessionObject.expires_at,
      ).toEqual(true);

      expect(
        renewedSessionObject.updated_at > sessionObject.updated_at,
      ).toEqual(true);

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        path: "/",
        httpOnly: true,
        name: "session_id",
        value: sessionObject.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000, // segundos
      });
    });

    test("With nonexistent session", async () => {
      const nonexistentToken =
        "c181d5d61f42487b15953b3f0e78b85bbd04238e10c582ab6cbdc7e6a648aba971f095af4b71c7e8415dbfa2a0cbc99d";

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${nonexistentToken}`,
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
        status_code: 401,
      });

      // Set-Cookie assertion
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        path: "/",
        httpOnly: true,
        name: "session_id",
        value: "invalid",
        maxAge: -1, // invalida o cookie navegador
      });
    });

    test("With expired session", async () => {
      // Ajusta o relógio do processo para passado
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS),
      });

      const createdUser = await orchestrator.createUser({
        username: "UserWithExpiredSession",
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      // Ajusta o relógio do processo para data atual
      jest.useRealTimers();

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
        status_code: 401,
      });

      // Set-Cookie assertion
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        path: "/",
        httpOnly: true,
        name: "session_id",
        value: "invalid",
        maxAge: -1, // invalida o cookie navegador
      });
    });

    test("With session expiry date in progress", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UserWithInProgressSession",
      });

      //Ajusta o relógio do processo para passado
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS / 2),
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: createdUser.id,
        username: "UserWithInProgressSession",
        email: createdUser.email,
        password: createdUser.password,
        created_at: createdUser.created_at.toISOString(),
        updated_at: createdUser.updated_at.toISOString(),
      });

      const versionUUID = 4;
      expect(uuidVersion(responseBody.id)).toBe(versionUUID);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      // Session renewal assertions
      const renewedSessionObject = await session.findOneValidByToken(
        sessionObject.token,
      );

      expect(
        renewedSessionObject.expires_at > sessionObject.expires_at,
      ).toEqual(true);

      expect(
        renewedSessionObject.updated_at > sessionObject.updated_at,
      ).toEqual(true);
    });
  });
});
