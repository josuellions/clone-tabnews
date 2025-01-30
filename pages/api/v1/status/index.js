import database from "infra/database.js";
import { InternalServerError } from "infra/errors";
/* TESTES V1
async function status(req, res) {
  const result = await database.query("SELECT 1 + 1 as sum;");

  console.log(result.rows);

  res.status(200).json({ message: "API de STATUS" });
}*/

async function status(req, res) {
  try {
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

    /* SEM TRATATIVA DE SQL Injection
    const databaseOpenConnectionsResult = await database.query(
      `SELECT count(*)::int from pg_stat_activity WHERE datname = '${databaseName}';`
    );*/

    /* COM TRATATIVA DE SQL Injection*/
    const databaseOpenConnectionsResult = await database.query({
      text: `SELECT count(*)::int from pg_stat_activity WHERE datname = $1;`,
      values: [databaseName],
    });
    const databaseOpenConnectionsValue = parseInt(
      databaseOpenConnectionsResult.rows[0].count,
    );

    /**INICIO - TESTE Sql Injection */

    //const requestDatabaseName = req.query.databaseName;

    /*const resquestDatabaseOpenConnectionsResult = await database.query(
      `SELECT count(*)::int from pg_stat_activity WHERE datname = '${requestDatabaseName}';`
    );*/

    /**TESTE Sql Injection - Sanitização (Resolução)*/
    /*
    const resquestDatabaseOpenConnectionsResultSanitizacao =
      await database.query({
        text: `SELECT count(*)::int from pg_stat_activity WHERE datname = $1;`,
        values: [requestDatabaseName],
      });
    console.log(resquestDatabaseOpenConnectionsResultSanitizacao.rows);
    */
    /**FIM - TESTE Sql Injection */

    //console.log(databaseOpenConnectionsValue);

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
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.log("\n Error no cath do controller:");
    console.log(publicErrorObject);
    //console.log(error);

    res.status(500).json(publicErrorObject);
  }
}

export default status;
