import retry from "async-retry";
import { faker } from "@faker-js/faker";

import database from "infra/database";
import migrator from "models/migrator";
import user from "models/user";

const STATUS_SUCCESS = 200;

async function waitForAllServices() {
  async function waitForWebServices() {
    // async function fetchStatusPage(bail, tryNumber) {
    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      //console.log(`>> Attempt: ${tryNumber} | HTTP Status: ${response.status}`);

      if (response.status !== STATUS_SUCCESS) {
        throw Error();
      }
    }

    return retry(fetchStatusPage, {
      retries: 100, // qtd tentativas
      maxTimeout: 1000, //tempo que aguarda para executar novamente
      minTimeout: 100, //tempo de espera entre tentativas
      maxRetryTime: 6000, //máximo tempo tentativas execução
    });
  }

  await waitForWebServices();
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userObject) {
  const userNewObject = {
    username:
      userObject.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject.email || faker.internet.email(),
    password:
      userObject.password ||
      faker.lorem
        .word({ length: { min: 10, max: 60 }, strategy: "shortest" })
        .trim(),
  };

  const result = await user.create(userNewObject);

  return result;
}

const orchestrator = {
  runPendingMigrations,
  waitForAllServices,
  clearDatabase,
  createUser,
};

export default orchestrator;
