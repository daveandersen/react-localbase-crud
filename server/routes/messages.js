import express from 'express';

import { getMessages, createMessage, updateMessage, deleteMessage, getOneMessage, deleteAllMessage} from '../controllers/messages.js'

const router = express.Router();

router.get('/', getMessages);
router.get('/:id', getOneMessage)
router.post('/', createMessage);
router.patch('/:id', updateMessage);
router.delete('/:id', deleteMessage);
router.delete('/', deleteAllMessage)


export default router;
