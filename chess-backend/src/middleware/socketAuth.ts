import { verify, TokenExpiredError } from "jsonwebtoken";
import config from "../config";
import UnauthorizedError from "../error/unauthorizedError";
import { ExtendedSocket } from ".././interface/socket";

// Socket.IO middleware for authentication
export function authenticateSocket(
  socket: ExtendedSocket,
  next: (err?: any) => void,
) {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new UnauthorizedError("Unauthenticated"));
  }
  try {
    const decoded = verify(token, config.jwt.jwt_secret!) as {
      id: string;
      name: string;
      email: string;
    };
    socket.user = decoded; // Attach user info to socket

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new UnauthorizedError("Token Expired"));
    }
    return next(new UnauthorizedError("Unauthenticated"));
  }
}
