import PostUser from '../models/users.js';
import mongoose from 'mongoose';

export const getUsers = async(req, res) => {
    try{
        const postUsers = await PostUser.find();

        res.status(200).json(postUsers);
    } catch (error) {
        res.status(404).json({User: error.User});
    }
}

export const getOneUser = async (req, res) => {
    const id = req.params.id

    try{
        const postUser = await PostUser.find({id: id}, function(err,obj) {
            //console.log(obj)
            if(err) console.log(err)
        } )

        res.status(200).json(postUser);
    } catch ( error ) {
        res.status(404).json({User: error.User});
    }
}

export const createUser = async (req, res) => {
    const newPost = new PostUser({
        id: req.body.id,
        username: req.body.username,
        password: req.body.password,
        description: req.body.description
    });

    try{
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({User: error.User});
    }
}

export const updateUser = async (req, res) => {
    const id = req.params.id;

    const updatedPost = await PostUser.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
        if(!data) {
            res.status(404).send({
                User: `Cannot update User with id:${id}. Maybe not found?`
            });
        } else res.send({User: "Updated!"})
    }).catch(err => {
        res.status(500).send({
            User: "Error updating id: " + id,
            error: err
        })
    });

    res.json(updatedPost);
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).semd('No post with that id');

    await PostUser.findByIdAndRemove(id);

    res.json({User: 'Post deleted successfully'});
}

export const deleteAllUser = async(req,res) => {
    await PostUser.deleteMany({});
    res.json({User: 'Deleted successfully'});
}

