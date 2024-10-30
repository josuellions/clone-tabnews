import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.update_at).toBeDefined();

  const parsedUpdateAt = new Date(responseBody.update_at).toISOString();
  expect(responseBody.update_at).toEqual(parsedUpdateAt);

  expect(responseBody.dependencies.database.version).toEqual("16.0");

  expect(responseBody.dependencies.database.opened_connections).toEqual(1);

  expect(responseBody.dependencies.database.max_connections).toEqual(100);
});

/*test.only("Teste de SQL Injection", async () => {
  const response = await fetch(
    "http://localhost:3000/api/v1/status?databaseName=local_db"
  );
  await fetch(
    "http://localhost:3000/api/v1/status?databaseName='; SELECT pg_sleep(4); --"
  );
});*/
/*
test.only("Teste de SQL Injection - Sanitização", async () => {
  await fetch(
    "http://localhost:3000/api/v1/status?databaseName='; SELECT pg_sleep(4); --"
  );
});*/
