import { FORBIDDEN_STATUS } from "../constants/status";

export class forbiddenError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = FORBIDDEN_STATUS;
  }
}