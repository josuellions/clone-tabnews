import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import migrator from "models/migrator";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(_, res) {
  const pendingMigrations = await migrator.listPendingMigrations();

  return res.status(200).json(pendingMigrations);
}

async function postHandler(_, res) {
  const migratedMigrations = await migrator.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    return res.status(201).json(migratedMigrations);
  }

  return res.status(200).json(migratedMigrations);
}
