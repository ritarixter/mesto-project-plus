import { UNAUTHORIZED_STATUS } from '../constants/status';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED_STATUS;
  }
}

export default UnauthorizedError;
