//All the necessary imports
import { Request, Response, NextFunction } from "express";
import { verify, TokenExpiredError } from "jsonwebtoken";
import config from "../config";
import UnauthorizedError from "../error/unauthorizedError";
import { AuthenticatedRequest } from "../interface/authenticatedRequest";

//Function to authenticate users
export function authenticate(
  req: Request<{}, {}, { user: AuthenticatedRequest }>,
  res: Response,
  next: NextFunction,
) {
  const { headers } = req;
  if (!headers.authorization) {
    next(new UnauthorizedError("Unauthenticated"));
    return;
  }
  const token = headers.authorization.split(" ");
  if (token.length !== 2 || token[0] !== "Bearer") {
    next(new UnauthorizedError("Unauthenticated"));
    return;
  }
  try {
    const decoded = verify(token[1], config.jwt.jwt_secret!) as {
      id: string;
      name: string;
      email: string;
    };

    req.body.user = decoded;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new UnauthorizedError("Token Expired"));
      return;
    }
    next(new UnauthorizedError("Unauthenticated"));
    return;
  }
}
