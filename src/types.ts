import { JwtPayload } from "jsonwebtoken";
import { Request } from 'express';

export interface IError extends Error {
  message: string;
  statusCode?: number;
}

export interface IUser extends JwtPayload {
  _id: string;
}

export interface IRequestMiddlewaresAuth extends Request {
  user: IUser;
}
export interface IRequestWithAuth extends Request {
  user?: string | JwtPayload;
}