import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUserProfileById, updateUserAvatarById } from '../controllers/users';

const router = Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUserProfileById);
router.patch('/me/avatar', updateUserAvatarById);


export default router;