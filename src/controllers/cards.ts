import { NextFunction, Request, Response } from 'express';
import { OK_STATUS } from '../constants/status';
import { badRequestError } from '../errors/badRequestErr';
import { forbiddenError } from '../errors/forbiddenErr';
import { NotFoundError } from '../errors/notFoundErr';
import Card from '../models/card';

export const createCard = (req: Request, res: Response, next:NextFunction) => {
 const owner = req.user._id;
  const { name, link } = req.body;
   Card.create({ name, link, owner })
    .then(card =>{
      if(!card){
        throw new badRequestError('На сервере произошла ошибка');
      }
      else{ res.status(OK_STATUS).send({ data: card }) }
    } )
    .catch(next);
};

export const getCards = (req: Request, res: Response, next:NextFunction) => {
   Card.find({})
   .then(cards =>{
    if(!cards){
      throw new badRequestError('На сервере произошла ошибка');
    }
    else{ res.status(OK_STATUS).send({ data: cards }) }
  } )
  .catch(next);
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findOne({ _id: cardId })
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Такой карточки не существует');
    } else if (card.owner.toString() !== userId) {
      throw new forbiddenError('У вас не достаточно прав, чтобы удалить эту карточку')
    } else {
      Card.deleteOne({ _id: card.id })
        .then(() => res.status(OK_STATUS).send({ message: 'Карточка успешно удалена'}))
        .catch(next);
    }
  })
  .catch(next)
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const ownerId = req.user?._id;
  if (!ownerId) {
    throw new forbiddenError('Вы не авторизованы')
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
    .catch(next);
}

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params
const ownerId = req.user?._id;
if (!ownerId) {
  throw new forbiddenError('Вы не авторизованы')
}

Card.findByIdAndUpdate(
  cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
.then((card)=>{
  if (!card) {
    throw new NotFoundError('Такой карточки не существует');
  } else {
    res.send({ name: card.name, link: card.link, likes: card.likes });
  }
})
.catch(next);
}