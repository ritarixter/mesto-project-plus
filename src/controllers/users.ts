import { NextFunction, Request, Response } from 'express';
import { OK_STATUS } from '../constants/status';
import { badRequestError } from '../errors/badRequestErr';
import { NotFoundError } from '../errors/notFoundErr';
import User from '../models/user';

export const createUser = (req: Request, res: Response, next:NextFunction) => {
  const { name, about, avatar } = req.body;
   User.create({ name, about, avatar })
   .then(user =>{
    if(!user){
      throw new badRequestError('На сервере произошла ошибка');
    }
    else{ res.status(OK_STATUS).send({ data: user }) }
  } )
  .catch(next);
};

export const getUsers = (req: Request, res: Response, next:NextFunction) => {
     User.find({})
     .then(users =>{
      if(!users){
        throw new badRequestError('На сервере произошла ошибка');
      }
      else{ res.status(OK_STATUS).send({ data: users }) }
    } )
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next:NextFunction) => {
   User.findById(req.params.userId)
   .then(user =>{
    if(!user){
      throw new NotFoundError('Пользователь не найден');
    }
    else{ res.status(OK_STATUS).send({ data: user }) }
  } )
  .catch(next);
};

export const updateUserProfileById = (req: Request, res: Response, next:NextFunction) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name: req.body.name },
  {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true // если пользователь не найден, он будет создан
})
.then(user =>{
  if(!user){
    throw new NotFoundError('Пользователь не найден');
  }
  else{ res.status(OK_STATUS).send({ data: user }) }
} )
.catch(next);
};

export const updateUserAvatarById = (req: Request, res: Response, next:NextFunction) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar: req.body.avatar },
  {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true // если пользователь не найден, он будет создан
})
.then(user =>{
  if(!user){
    throw new NotFoundError('Пользователь не найден');
  }

  else{
    res.status(OK_STATUS).send({ data: user }) }
} )
.catch(next);
};
