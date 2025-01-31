import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

const defaultMigrationOptions = {
  dir: resolve("infra", "migrations"),
  migrationsTable: "pgmigrations",
  direction: "up",
  dryRun: true,
  verbose: true,
};

async function getHandler(_, res) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: true,
    });

    return res.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(_, res) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }

    return res.status(200).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}
