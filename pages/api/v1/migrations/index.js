import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(req, res) {
  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    migrationsTable: "pgmigrations",
    direction: "up",
    dryRun: true,
    verbose: true,
  };

  try {
    if (req.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);

      dbClient.end();

      return res.status(200).json(pendingMigrations);
    }

    if (req.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      dbClient.end();

      if (migratedMigrations.length > 0) {
        return res.status(201).json(migratedMigrations);
      }

      return res.status(200).json(migratedMigrations);
    }

    return res.status(405).end();
  } catch (error) {
    console.log(error);
  }
}
