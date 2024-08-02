import * as userModels from "../models/user";
import jwt from "jsonwebtoken";
import { verify } from "jsonwebtoken";
import { Response } from "express";
import NotFoundError from "../error/notFoundError";
import UnauthorizedError from "../error/unauthorizedError";
const { sign } = jwt;
const bcrypt = require("bcrypt");
import config from "../config";
import ForbiddenError from "../error/forbiddenError";
import { StatusCodes } from "http-status-codes";
import { ACCESS_TOKEN_AGE, REFRESH_TOKEN_AGE } from "../constants";

let refreshTokens: string[] = [];
export async function login(email: string, password: string, res: Response) {
  const userExists = await userModels.UserModel.findByEmail(email);

  if (userExists.length == 0) {
    throw new NotFoundError("No Matching Email");
  }
  const match = await bcrypt.compare(password, userExists[0].passwordHash);
  if (!match) {
    throw new UnauthorizedError("Passwords Don't Match");
  }

  let payload = {
    id: userExists[0].id,
    name: userExists[0].name,
    email: userExists[0].email,
  };
  payload.name = payload.name.charAt(0).toUpperCase() + payload.name.slice(1);
  const accessToken = sign(payload, config.jwt.jwt_secret!, {
    expiresIn: config.jwt.accessTokenExpiryMS,
  });
  const refreshToken = sign(payload, config.jwt.jwt_secret!, {
    expiresIn: config.jwt.refreshTokenExpiryMS,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: false,
    secure: false,
    maxAge: ACCESS_TOKEN_AGE,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: REFRESH_TOKEN_AGE,
  });

  refreshTokens.push(refreshToken);
  res.status(StatusCodes.OK).json({
    accessToken: accessToken,
    refreshToken: refreshToken,
    message: `Welcome Back ${payload.name}`,
  });
}
