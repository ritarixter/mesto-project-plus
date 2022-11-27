import { CONFLICT_STATUS } from '../constants/status';

class ConfictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICT_STATUS;
  }
}

export default ConfictError;
