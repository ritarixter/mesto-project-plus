import { Router } from 'express';
import validateCard from '../validators/validateCard';
import validateId from '../validators/validateId';
import {
  createCard, deleteCardById, dislikeCard, getCards, likeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateId, deleteCardById);
router.put('/:cardId/likes', validateId, likeCard);
router.delete('/:cardId/likes', validateId, dislikeCard);

export default router;
