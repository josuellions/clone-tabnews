import { createRouter } from "next-connect";
import * as cookie from "cookie";

import controller from "infra/controller.js";

import authentication from "models/authentication.js";
import session from "models/session.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(req, res) {
  const userInputValues = req.body;

  const authenticatedUser = await authentication.getAuthenticateUser(
    userInputValues.email,
    userInputValues.password,
  );

  const newSession = await session.create(authenticatedUser.id);

  //res.setHeader("Set-Cookie", `session_id=${newSession.token}; Path=/`);

  const setCookie = cookie.serialize("session_id", newSession.token, {
    path: "/",
    httpOnly: true, //ativa somente site responsável acessar através das requisições pelo head
    secure: process.env.NODE_ENV === "production",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000, // convertendo para segundo
    //expires: new Date(newSession.expires_at),
  });
  res.setHeader("Set-Cookie", setCookie);

  return res.status(201).json(newSession);
}
