import * as userModels from "../models/user";
import { BCRYPT_SALT_ROUNDS } from "../constants";
import bcrypt from "bcrypt";
import ConflictError from "../error/conflictError";
import ValidationError from "../error/validationError";
import Game from "../models/game";
import NotFoundError from "../error/notFoundError";

//Function to create a new user
export async function createUser(
  name: string,
  email: string,
  password: string,
  photo: string,
) {
  if ((await userModels.UserModel.findByEmail(email)).length !== 0) {
    throw new ConflictError("Email already taken");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    let data = await userModels.UserModel.create(
      name,
      email,
      hashedPassword,
      photo,
    );
    return data;
  } catch (error) {
    throw new ValidationError("Error creating user", " ");
  }
}

//Function to get all the details of the user (including the games played by the user)using the email
export async function getUserDetails(
  email: string,
  limit: number,
  offset: number,
) {
  let foundUser = await userModels.UserModel.findByEmail(email);
  let gameDetails = await Game.getGamesByUserId(foundUser[0].id, limit, offset);

  let enhancedGameDetails = gameDetails.map((gameDetail) => ({
    ...gameDetail,
    yourId: foundUser[0].id,
  }));
  let totalGames = await Game.countGamesByUserId(foundUser[0].id);
  let totalPages = Math.ceil(totalGames / limit);

  if (foundUser.length === 0) {
    throw new ConflictError("No such user");
  }
  return { foundUser, enhancedGameDetails, totalPages };
}
