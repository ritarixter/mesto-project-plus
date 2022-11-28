import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { secretKey } from '../constants/auth';
import UnauthorizedError from '../errors/UnauthorizedErr';
import { IRequestWithAuth } from '../types';

export default (req: IRequestWithAuth, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, secretKey);
  } catch {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = payload;
  next();
};
