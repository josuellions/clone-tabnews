import { createRouter } from "next-connect";

import controller from "infra/controller.js";
import session from "models/session.js";
import user from "models/user";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const sessionToken = req.cookies.session_id;

  const sessionObject = await session.findOneValidByToken(sessionToken);
  const renewedSessionObject = await session.renew(sessionObject.id);
  const userFound = await user.findOneById(sessionObject.user_id);

  controller.setSessionCookie(renewedSessionObject.token, res);

  // Desativando o cache response para evitar status 304, e atualizar dados navegado
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, max-age=0, must-revalidate",
  );

  return res.status(200).json(userFound);
}
