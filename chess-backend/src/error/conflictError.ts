import CustomError from "./customError";
import { StatusCodes } from "http-status-codes";

class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.CONFLICT);
  }
}

export default ConflictError;
