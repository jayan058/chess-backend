import CustomError from './customError';
import { StatusCodes } from 'http-status-codes';

class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
  }
}

export default ForbiddenError;