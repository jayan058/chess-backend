import { Request } from "express";
import { UserDetails } from "../interface/userDetails";
import { AuthenticatedRequest } from "../interface/authenticatedRequest";
export function filePathCleaner(
  userDetails: UserDetails,
  req: Request<any, any, { user: AuthenticatedRequest }>,
) {
  userDetails.profilePicture = `${req.protocol}://${req.get("host")}/${userDetails.profilePicture}`;
  userDetails.profilePicture = userDetails.profilePicture.replace(/\\+/g, "/");
  userDetails.profilePicture = userDetails.profilePicture.replace(/\/src/, "");
}
