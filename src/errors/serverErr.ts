import { SERVER_ERROR_STATUS } from '../constants/status';

class ServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = SERVER_ERROR_STATUS;
  }
}

export default ServerError;
