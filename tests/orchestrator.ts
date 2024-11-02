import retry from "async-retry";
import database from "infra/database";

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

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;
