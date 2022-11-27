import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from 'express';

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

export interface IRequestWithAuth<TBody = any> extends Request<any, any, TBody> {
  user?:{
    _id: string
  }
}