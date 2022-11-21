import { NOT_FOUND_ERROR_STATUS } from "../constants/status";

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND_ERROR_STATUS;
  }
}