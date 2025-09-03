import * as cookie from "cookie";

import session from "models/session";

import {
  MethodNotAllowedError,
  InternalServerError,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
} from "./errors";

function onNoMatchHandler(_, res) {
  const publicErrorObject = new MethodNotAllowedError();

  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, _, res) {
  if (
    error instanceof ValidationError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError
  ) {
    return res.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    //statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicErrorObject);

  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function setSessionCookie(sessionToken, res) {
  const setCookie = cookie.serialize("session_id", sessionToken, {
    path: "/",
    httpOnly: true, //ativa somente site responsável acessar através das requisições pelo head
    secure: process.env.NODE_ENV === "production",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000, // convertendo para segundo
    //expires: new Date(newSession.expires_at),
  });

  //res.setHeader("Set-Cookie", `session_id=${newSession.token}; Path=/`);
  res.setHeader("Set-Cookie", setCookie);
}

function clearSessionCookie(res) {
  const setCookie = cookie.serialize("session_id", "invalid", {
    path: "/",
    httpOnly: true, //ativa somente site responsável acessar através das requisições pelo head
    secure: process.env.NODE_ENV === "production",
    maxAge: -1, // invalida o cookie navegador
  });

  res.setHeader("Set-Cookie", setCookie);
}

const controller = {
  clearSessionCookie,
  setSessionCookie,
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
