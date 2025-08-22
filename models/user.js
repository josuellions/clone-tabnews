import database from "infra/database";
import { ValidationError } from "infra/errors";

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
      action: "Informe outro email para realizar o cadastro.",
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
      action: "Informe outro username para realizar o cadastro.",
    });
  }
}

async function create(userInputValues) {
  //regras de negocio
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);

  return newUser;
}

const user = {
  create,
};

export default user;
