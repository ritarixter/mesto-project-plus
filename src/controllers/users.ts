import { Request, Response } from 'express';
import { USER_NOT_FOUND_MESSAGE } from '../constants/message';
import NotFoundError from '../errors/notFoundErr';
import validationCheck from '../utils/utils';
import { OK_STATUS } from '../constants/status';
import User from '../models/user';

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
      } else { res.status(OK_STATUS).send({ data: user }); }
    })
    .catch((err) => { validationCheck(err); });
};

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
      } else { res.status(OK_STATUS).send({ data: users }); }
    })
    .catch((err) => { validationCheck(err); });
};

export const getUserById = (req: Request, res: Response) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
      } else { res.status(OK_STATUS).send({ data: user }); }
    })
    .catch((err) => { validationCheck(err); });
};

export const updateUserProfileById = (req: Request, res: Response) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name: req.body.name },
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
    .catch((err) => { validationCheck(err); });
};

export const updateUserAvatarById = (req: Request, res: Response) => {
  const userId = req.user._id;
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
    .catch((err) => { validationCheck(err); });
};
