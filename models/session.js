import crypto from "node:crypto";

import database from "infra/database";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000; // 30 dias em mile_segundos

async function runInsertQuery(token, userId, expiresAt) {
  const results = await database.query({
    text: `
      INSERT INTO
        sessions (token, user_id, expires_at)
      VALUES
        ($1,$2,$3)
      RETURNING
        *
      ;
    `,
    values: [token, userId, expiresAt],
  });

  return results.rows[0];
}

async function create(userId) {
  const bytes = 48;
  const token = crypto.randomBytes(bytes).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newSession = await runInsertQuery(token, userId, expiresAt);

  return newSession;
}

const session = {
  EXPIRATION_IN_MILLISECONDS,
  create,
};

export default session;
