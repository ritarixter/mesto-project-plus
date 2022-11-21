import { BAD_REQUEST_STATUS } from "../constants/status";

export class badRequestError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST_STATUS;
  }
}