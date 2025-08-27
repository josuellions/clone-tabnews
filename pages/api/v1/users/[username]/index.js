import { createRouter } from "next-connect";

import controller from "infra/controller.js";
import user from "models/user.js";

const router = createRouter();

router.get(getHandler);
router.patch(patchHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const username = req.query.username;

  const userFound = await user.findOneByUserName(username);

  return res.status(200).json(userFound);
}

async function patchHandler(req, res) {
  const username = req.query.username;

  const userInputValues = req.body;
  const updateUser = await user.update(username, userInputValues);

  return res.status(200).json(updateUser);
}
