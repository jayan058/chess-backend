import CustomError from "./customError";
import { StatusCodes } from "http-status-codes";

class ValidationError extends CustomError {
  constructor(message: string, details: any) {
    super(message, StatusCodes.BAD_REQUEST);
    this.details = details;
  }

  details: any;
}

export default ValidationError;
