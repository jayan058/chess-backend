
import { AuthenticatedRequest } from "../interface/authenticatedRequest";
import { Request } from "express";

export const mockReq = {
    protocol: "http",
    get: (header: string) => {
      if (header === "host") {
        return "localhost:3000";
      }
      return undefined;
    },
  } as Request<any, any, { user: AuthenticatedRequest }>;