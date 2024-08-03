//Necessary imports
import { AuthenticatedRequest } from "../interface/authenticatedRequest";
import { Request } from "express";

//Mock request used for cleaning the file paths for photos in socket connections
export const mockReq = {
  protocol: "http",
  get: (header: string) => {
    if (header === "host") {
      return "localhost:3000";
    }
    return undefined;
  },
} as Request<any, any, { user: AuthenticatedRequest }>;
