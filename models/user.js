import database from "infra/database";
import password from "models/password.js";
import { ValidationError, NotFoundError } from "infra/errors";

async function runInsertQuery(userInputValues) {
  //implementação e insert
  const result = await database.query({
    text: `
          INSERT INTO 
            users (username, email, password) 
          VALUES 
            ($1, $2, $3)
          RETURNING
            *
          ;
          `,
    values: [
      userInputValues.username,
      userInputValues.email,
      userInputValues.password,
    ],
  });

  return result.rows[0];
}

async function runUpdateQuery(userWithNewValues) {
  const result = await database.query({
    text: `
      UPDATE 
        users
      SET
        username = $2,
        email = $3,
        password = $4,
        updated_at = timezone('utc', now())
      WHERE
        id = $1
      RETURNING
        *
      ;
      `,
    values: [
      userWithNewValues.id,
      userWithNewValues.username,
      userWithNewValues.email,
      userWithNewValues.password,
    ],
  });

  return result.rows[0];
}

async function validateUniqueEmail(email) {
  const result = await database.query({
    text: `
          SELECT email
          FROM
            users 
          WHERE 
            LOWER(email) = LOWER($1)
          ;
          `,
    values: [email],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está cadastrado.",
      action: "Informe outro email para realizar esta operação.",
    });
  }
}

async function validateUniqueUsername(username) {
  const result = await database.query({
    text: `
          SELECT username
          FROM
            users 
          WHERE 
            LOWER(username) = LOWER($1)
          ;
          `,
    values: [username],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O username informado já está cadastrado.",
      action: "Informe outro username para realizar esta operação.",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

async function runSelectQuery(username) {
  const result = await database.query({
    text: `
          SELECT 
            *
          FROM
            users 
          WHERE
            LOWER(username) = LOWER($1)
          LIMIT
            1
          ;
          `,
    values: [username],
  });

  if (result.rowCount === 0) {
    throw new NotFoundError({
      message: "O usuário informado sem cadastro.",
      action: "Informe corretamente username para realizar busca.",
    });
  }

  return result.rows[0];
}

async function runSelectQueryEmail(email) {
  const result = await database.query({
    text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
        LIMIT
          1
        ;`,
    values: [email],
  });

  if (result.rowCount === 0) {
    throw new NotFoundError({
      message: "O email informado não foi encontrado no sistema.",
      action: "Verifique se o email está digitado corretamente.",
    });
  }

  return result.rows[0];
}

async function findOneByUserName(username) {
  const userFound = await runSelectQuery(username);

  return userFound;
}

async function findOneByEmail(email) {
  const userFound = await runSelectQueryEmail(email);

  return userFound;
}

async function create(userInputValues) {
  //regras de negocio
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);

  return newUser;
}

async function update(username, userInputValues) {
  const currentUser = await findOneByUserName(username);

  if ("username" in userInputValues) {
    await validateUniqueUsername(userInputValues.username);
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };

  const updateUser = await runUpdateQuery(userWithNewValues);

  return updateUser;
}

const user = {
  create,
  update,
  findOneByEmail,
  findOneByUserName,
};

export default user;
