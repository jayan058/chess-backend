import * as userModels from "../models/user";
import { BCRYPT_SALT_ROUNDS } from "../constants";
import bcrypt from "bcrypt";
import ConflictError from "../error/conflictError";
import ValidationError from "../error/validationError";
import Game from "../models/game";
export async function createUser(
    name: string,
    email: string,
    password: string,
    photo:string
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
  export async function getUserDetails(email: string, limit: number, offset: number) {
    let foundUser = await userModels.UserModel.findByEmail(email);
    let gameDetails = await Game.getGamesByUserId(foundUser[0].id, limit, offset);
    let enhancedGameDetails = gameDetails.map((gameDetail) => ({
      ...gameDetail,
      yourId: foundUser[0].id,
    }));
  
    if (foundUser.length === 0) {
      throw new ConflictError("No such user");
    }
    return { foundUser, enhancedGameDetails };
  }
  


  
  