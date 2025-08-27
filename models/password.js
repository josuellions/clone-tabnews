import bcryptjs from "bcryptjs";

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function hash(password) {
  const rounds = getNumberOfRounds();

  const passwordHash = bcryptjs.hash(password, rounds);

  return passwordHash;
}

async function compare(providedPassword, storedPassword) {
  const isValidatedCompare = await bcryptjs.compare(
    providedPassword,
    storedPassword,
  );

  return isValidatedCompare;
}

const password = {
  hash,
  compare,
};

export default password;
