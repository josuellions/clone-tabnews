import email from "infra/email";

import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  orchestrator.waitForAllServices();
});

describe("infra/email", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "Clone-Tabnews <contato@clonetabnews.com.br>",
      to: "contato@destinatario.com.br",
      subject: "Teste de assunto email 1",
      text: "Texto corpo da mensagem email 1",
    });

    await email.send({
      from: "Clone-Tabnews <contato@clonetabnews.com.br>",
      to: "contato@destinatario.com.br",
      subject: "Teste de assunto email 2",
      text: "Texto corpo da mensagem email 2",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail).toEqual({
      id: lastEmail.id,
      size: lastEmail.size,
      sender: "<contato@clonetabnews.com.br>",
      recipients: ["<contato@destinatario.com.br>"],
      created_at: lastEmail.created_at,
      subject: "Teste de assunto email 2",
      text: "Texto corpo da mensagem email 2\n",
    });
  });
});
