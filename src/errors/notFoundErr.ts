import { NOT_FOUND_ERROR_STATUS } from '../constants/status';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND_ERROR_STATUS;
  }
}

export default NotFoundError;
