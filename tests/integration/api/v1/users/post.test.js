import database from "infra/database";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST to /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      await database.query({
        text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3);",
        values: [
          "josuellopes",
          "josuellopes@email, password.com.br",
          "senha123",
        ],
      });

      // await database.query({
      //   text: "INSERT INTO users (username, email) VALUES ($1, $2, $3);",
      //   values: ["josuelalves", "Josuellopes@email.com.br", "senha123"],
      // });

      const users = await database.query("SELECT * FROM users;");

      console.info(">>TEST USERS");
      console.log(users.rows);
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
      });
      expect(response.status).toBe(201);
    });
  });
});
