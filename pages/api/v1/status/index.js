import { createRouter } from "next-connect";

import database from "infra/database.js";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(_, res) {
  const publicErrorObject = new MethodNotAllowedError();

  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, _, res) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });
  console.log("\n Error no cath do next-connect:");
  console.log(publicErrorObject);

  res.status(500).json(publicErrorObject);
}

async function getHandler(_, res) {
  const updateAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue =
    databaseVersionResult.rows[0].server_version.split(" ")[0];

  const databaseMaxConnectionResult = await database.query(
    "SHOW max_connections",
  );
  const databaseMaxConnectionValue = parseInt(
    databaseMaxConnectionResult.rows[0].max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;

  const databaseOpenConnectionsResult = await database.query({
    text: `SELECT count(*)::int from pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });
  const databaseOpenConnectionsValue = parseInt(
    databaseOpenConnectionsResult.rows[0].count,
  );

  res.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionValue,
        opened_connections: databaseOpenConnectionsValue,
      },
    },
  });
}
