import { createRouter } from "next-connect";

import controller from "infra/controller.js";
import user from "models/user.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const username = req.query.username;

  const userFound = await user.findOneByUserName(username);

  return res.status(200).json(userFound);
}
