import { date } from "joi";
import BaseModel from "./baseModel";

export class UserModel extends BaseModel {
  static async create(
    name: string,
    email: string,
    password: string,
    photo: string,
  ) {
    const userToCreate = {
      name: name,
      password_hash: password,
      profile_picture: photo,
      email: email,
      created_at: new Date(),
      updated_at: new Date(),
    };
    await this.queryBuilder().insert(userToCreate).table("users");
  }

  static async findByEmail(email: string) {
    let matchingEmail = await this.queryBuilder()
      .select("*")
      .from("users")
      .where("email", email);

    return matchingEmail;
  }

  static async findById(id: number) {
    let matchingUser = await this.queryBuilder()
      .select("*")
      .from("users")
      .where("id", id);

    return matchingUser;
  }

  static async getTotalUsers() {
    const totalCountQuery =
      await this.queryBuilder()("users").count("id as totalUsers");
    return totalCountQuery[0].totalUsers;
  }
}
