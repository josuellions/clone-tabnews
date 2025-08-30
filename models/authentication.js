import { NotFoundError, UnauthorizedError } from "infra/errors";
import password from "./password";
import user from "./user";

async function findUserByEmail(providedEmail) {
  try {
    const storedUser = await user.findOneByEmail(providedEmail);

    return storedUser;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação email não confere.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }

    throw error;
  }
}

async function validatePassword(providedPassword, storedPassword) {
  const correctPasswordMatch = await password.compare(
    providedPassword,
    storedPassword,
  );

  if (!correctPasswordMatch) {
    throw new UnauthorizedError({
      message: "Dados de autenticação senha não confere.",
      action: "Verifique se os dados enviados estão corretos.",
    });
  }
}

async function getAuthenticateUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findUserByEmail(providedEmail);

    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }
    throw error;
  }
}

const authentication = {
  getAuthenticateUser,
};

export default authentication;
