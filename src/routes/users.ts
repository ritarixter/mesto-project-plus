import { Router } from 'express';
import validateId from '../validators/validateId';
import validateUser from '../validators/validateUser';
import validateUserAvatar from '../validators/validateUserAvatar';
import {
  getUsers, getUserById, updateUserProfileById, updateUserAvatarById, getUserInfo,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:id', validateId, getUserById);
router.patch('/me', validateUser, updateUserProfileById);
router.patch('/me/avatar', validateUserAvatar, updateUserAvatarById);

export default router;
