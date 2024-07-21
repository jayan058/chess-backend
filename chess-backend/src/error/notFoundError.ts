import CustomError from './customError';
import { StatusCodes } from 'http-status-codes';

class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export default NotFoundError;