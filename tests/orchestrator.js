import retry from "async-retry";
import { faker } from "@faker-js/faker";

import database from "infra/database";
import migrator from "models/migrator";
import session from "models/session";
import user from "models/user";

const STATUS_SUCCESS = 200;
const EMAIL_HTTP_URL = `${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

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

  async function waitForEmailServices() {
    async function fetchEmailPage() {
      const response = await fetch(EMAIL_HTTP_URL);

      if (response.status !== STATUS_SUCCESS) {
        throw Error();
      }
    }

    return retry(fetchEmailPage, {
      retries: 100, // qtd tentativas
      maxTimeout: 1000, //tempo que aguarda para executar novamente
      minTimeout: 100, //tempo de espera entre tentativas
      maxRetryTime: 6000, //máximo tempo tentativas execução
    });
  }

  await waitForWebServices();
  await waitForEmailServices();
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
      userObject?.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject?.email || faker.internet.email(),
    password:
      userObject?.password ||
      faker.lorem
        .word({ length: { min: 10, max: 60 }, strategy: "shortest" })
        .trim(),
  };

  const result = await user.create(userNewObject);

  return result;
}

async function createSession(userId) {
  return await session.create(userId);
}

async function deleteAllEmails() {
  await fetch(`${EMAIL_HTTP_URL}/messages`, {
    method: "DELETE",
  });
}

async function getLastEmail() {
  const emailListResponse = await fetch(`${EMAIL_HTTP_URL}/messages`);
  const emailListBody = await emailListResponse.json();
  const lastEmailItem = emailListBody.pop();

  const emailTextResponse = await fetch(
    `${EMAIL_HTTP_URL}/messages/${lastEmailItem.id}.plain`,
  );

  const emailTextBody = await emailTextResponse.text();

  lastEmailItem.text = emailTextBody;

  return lastEmailItem;
}

const orchestrator = {
  runPendingMigrations,
  waitForAllServices,
  deleteAllEmails,
  clearDatabase,
  createSession,
  getLastEmail,
  createUser,
};

export default orchestrator;
