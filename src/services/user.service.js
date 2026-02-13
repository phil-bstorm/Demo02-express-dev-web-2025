import db from "../database/index.js";
import bcrypt from "bcrypt";

const findByUsername = async (username) => {
  const existingUser = await db.User.findOne({
    where: {
      username: username,
    },
  });

  return existingUser;
};

// CREATE : regle métier (pas deux user avec le même username)
const create = async (data) => {
  const existingUser = await findByUsername(data.username);
  if (existingUser) {
    throw new Error("Username already exists.");
  }

  // Encryption du mot de passe (avec Bcrypt ou Argon2 ou Blowfish)
  data.password = await bcrypt.hash(data.password, 14);

  // INSERT INTO USER VALUES(data)
  const createdUser = await db.User.create(data);
  return createdUser;
};

const login = async (data) => {
  const existingUser = await findByUsername(data.username);
  if (!existingUser) {
    throw new Error("Invalide credential");
  }

  // Comparaison entre le password de data et existingUser
  const areTheSame = await bcrypt.compare(data.password, existingUser.password);

  if (!areTheSame) {
    throw new Error("Invalide credential");
  }
  return existingUser;
};

export default {
  create,
  findByUsername,
  login,
};
