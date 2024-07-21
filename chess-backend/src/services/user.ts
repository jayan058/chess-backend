import * as userModels from "../models/user";
import { BCRYPT_SALT_ROUNDS } from "../constants";
import bcrypt from "bcrypt";
import ConflictError from "../error/conflictError";
import ValidationError from "../error/validationError";
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

  
  