import CustomError from './customError';
import { StatusCodes } from 'http-status-codes';

class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export default UnauthorizedError;