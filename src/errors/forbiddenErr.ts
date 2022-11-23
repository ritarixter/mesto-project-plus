import { FORBIDDEN_STATUS } from '../constants/status';

class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = FORBIDDEN_STATUS;
  }
}

export default ForbiddenError;
