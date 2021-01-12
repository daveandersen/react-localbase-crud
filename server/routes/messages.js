import express from 'express';

import { getPosts, createPost, updatePost, deletePost, getOne} from '../controllers/messages.js'

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getOne)
router.post('/', createPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
