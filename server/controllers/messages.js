import PostMessage from '../models/postMessage.js';
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
    try{
        const postMessages = await PostMessage.find();

        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const getOne = async (req, res) => {
    const id = req.params.id

    try{
        const postMessage = await PostMessage.find({id: id}, function(err,obj) {console.log(obj)})

        res.status(200).json(postMessage);
    } catch ( error ) {
        res.status(404).json({message: error.message});
    }
}

export const createPost = async (req, res) => {
    console.log(req.body)
    const newPost = new PostMessage({
        id: req.body.id,
        message: req.body.message
    });

    try{
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).semd('No post with that id');

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id}, { new: true });
    // console.log(updatePost);
    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).semd('No post with that id');

    await PostMessage.findByIdAndRemove(id);

    res.json({message: 'Post deleted successfully'});
}

