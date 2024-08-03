import * as userModels from "../models/user";
import jwt, { verify, sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config";
import { Response, Request } from "express";
import { ACCESS_TOKEN_AGE, REFRESH_TOKEN_AGE } from "../constants";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../error/notFoundError";
import UnauthorizedError from "../error/unauthorizedError";
import ForbiddenError from "../error/forbiddenError";

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
    expiresIn: ACCESS_TOKEN_AGE,
  });
  const refreshToken = sign(payload, config.jwt.jwt_secret!, {
    expiresIn: REFRESH_TOKEN_AGE,
  });

  refreshTokens.push(refreshToken);
  res.status(StatusCodes.OK).json({
    accessToken: accessToken,
    refreshToken: refreshToken,
    message: `Welcome Back ${payload.name}`,
  });
}

// Add the refresh token endpoint
export async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Refresh token is required" });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "Invalid refresh token" });
  }

  try {
    const payload = verify(refreshToken, config.jwt.jwt_secret!);
    const { id, name, email } = payload as {
      id: string;
      name: string;
      email: string;
    };
    const newPayload = { id, name, email };

    try {
      const newAccessToken = sign(newPayload, config.jwt.jwt_secret!, {
        expiresIn: ACCESS_TOKEN_AGE,
      });

      res.status(StatusCodes.OK).json({
        accessToken: newAccessToken,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid refresh token" });
  }
}
