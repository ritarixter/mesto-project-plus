import { SERVER_ERROR_STATUS } from "../constants/status";

export class serverError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = SERVER_ERROR_STATUS;
  }
}