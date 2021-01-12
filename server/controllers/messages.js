import PostMessage from '../models/postMessage.js';
import mongoose from 'mongoose';

export const getMessages = async (req, res) => {
    try{
        const postMessages = await PostMessage.find();

        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const getOneMessage = async (req, res) => {
    const id = req.params.id

    try{
        const postMessage = await PostMessage.find({id: id}, function(err,obj) {
            //console.log(obj)
            if(err) console.log(err)
        } )

        res.status(200).json(postMessage);
    } catch ( error ) {
        res.status(404).json({message: error.message});
    }
}

export const createMessage = async (req, res) => {
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

export const updateMessage = async (req, res) => {
    const id = req.params.id;

    const updatedPost = await PostMessage.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
        if(!data) {
            res.status(404).send({
                message: `Cannot update message with id:${id}. Maybe not found?`
            });
        } else res.send({message: "Updated!"})
    }).catch(err => {
        res.status(500).send({
            message: "Error updating id: " + id,
            error: err
        })
    });

    res.json(updatedPost);
}

export const deleteMessage = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).semd('No post with that id');

    await PostMessage.findByIdAndRemove(id);

    res.json({message: 'Post deleted successfully'});
}

