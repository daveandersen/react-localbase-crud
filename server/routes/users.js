import express from 'express';

import { getUsers, createUser, updateUser, deleteUser, getOneUser, deleteAllUser} from '../controllers/users.js'

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getOneUser)
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.delete('/', deleteAllUser)


export default router;
