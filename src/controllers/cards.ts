import { Request, Response } from 'express';
import BadRequestError from '../errors/badRequestErr';
import ForbiddenError from '../errors/forbiddenErr';
import NotFoundError from '../errors/notFoundErr';
import validationCheck from '../utils/utils';
import { OK_STATUS } from '../constants/status';
import Card from '../models/card';
import { ERROR_ON_SERVER_MESSAGE } from '../constants/message';

export const createCard = (req: Request, res: Response) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new BadRequestError(ERROR_ON_SERVER_MESSAGE);
      } else { res.status(OK_STATUS).send({ data: card }); }
    })
    .catch((err) => { validationCheck(err); });
};

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new BadRequestError(ERROR_ON_SERVER_MESSAGE);
      } else { res.status(OK_STATUS).send({ data: cards }); }
    })
    .catch((err) => { validationCheck(err); });
};

export const deleteCardById = (req: Request, res: Response) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findOne({ _id: cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      } else if (card.owner.toString() !== userId) {
        throw new ForbiddenError('У вас не достаточно прав, чтобы удалить эту карточку');
      } else {
        Card.deleteOne({ _id: card.id })
          .then(() => res.status(OK_STATUS).send({ message: 'Карточка успешно удалена' }))
          .catch((err) => { validationCheck(err); });
      }
    })
    .catch((err) => { validationCheck(err); });
};

export const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const ownerId = req.user?._id;
  if (!ownerId) {
    throw new ForbiddenError('Вы не авторизованы');
  }
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: ownerId } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      } else {
        res.status(OK_STATUS).send({ name: card.name, link: card.link, likes: card.likes });
      }
    })
    .catch((err) => { validationCheck(err); });
};

export const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const ownerId = req.user?._id;
  if (!ownerId) {
    throw new ForbiddenError('Вы не авторизованы');
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      } else {
        res.send({ name: card.name, link: card.link, likes: card.likes });
      }
    })
    .catch((err) => { validationCheck(err); });
};
