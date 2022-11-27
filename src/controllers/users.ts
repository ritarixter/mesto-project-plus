import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import ConfictError from '../errors/confictErr';
import { secretKey } from '../constants/auth';
import BadRequestError from '../errors/badRequestErr';
import { IRequestWithAuth } from '../types';
import { ERROR_ON_SERVER_MESSAGE, USER_NOT_FOUND_MESSAGE } from '../constants/message';
import NotFoundError from '../errors/notFoundErr';
import { OK_STATUS } from '../constants/status';
import User from '../models/user';

export const createUser = (req: Request, res: Response, next:NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash:string) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          if (!user) {
            throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
          } else { res.status(OK_STATUS).send('Регистрация прошла успешно!'); }
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError(err.message));
          } else if (err.code === 11000) {
            next(new ConfictError(err.message));
          } else {
            next(err);
          }
        });
    });
};

export const login = (req: Request, res: Response, next:NextFunction) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 604800000,
        sameSite: true,
      }).send({ token });
    })
    .catch(next);
};

export const getUsers = (req: Request, res: Response, next:NextFunction) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
      } else { res.status(OK_STATUS).send({ data: users }); }
    })
    .catch(next);
};

export const getUserInfo = (req: IRequestWithAuth, res: Response, next:NextFunction) => {
  const { user } = req;
  if (!user) {
    throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
  }
  User.findById(user._id)
    .then((users) => {
      if (!users) {
        throw new BadRequestError(ERROR_ON_SERVER_MESSAGE);
      } else {
        res.status(OK_STATUS).send({ data: users });
      }
    })
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next:NextFunction) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
      } else { res.status(OK_STATUS).send({ data: user }); }
    })
    .catch(next);
};

export const updateUserProfileById = (req: IRequestWithAuth, res: Response, next:NextFunction) => {
  const userId = req.user?._id;
  User.findByIdAndUpdate(
    userId,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
      } else { res.status(OK_STATUS).send({ data: user }); }
    })
    .catch(next);
};

export const updateUserAvatarById = (req: IRequestWithAuth, res: Response, next:NextFunction) => {
  const userId = req.user?._id;
  User.findByIdAndUpdate(
    userId,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
      } else {
        res.status(OK_STATUS).send({ data: user });
      }
    })
    .catch(next);
};
