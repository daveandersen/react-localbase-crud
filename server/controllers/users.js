import User from '../models/users.js';
import mongoose from 'mongoose';

export const getUsers = async(req, res) => {
    try{
        const users = await User.find();

        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({User: error.User});
    }
}

export const getOneUser = async (req, res) => {
    const id = req.params.id

    try{
        const user = await User.find({id: id}, function(err,obj) {
            //console.log(obj)
            if(err) console.log(err)
        } )

        res.status(200).json(user);
    } catch ( error ) {
        res.status(404).json({User: error.User});
    }
}

export const createUser = async (req, res) => {
    const newUser = new User({
        id: req.body.id,
        username: req.body.username,
        password: req.body.password,
        carID: req.body.carID
    });

    try{
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(409).json({User: error.User});
    }
}

export const updateUser = async (req, res) => {
    const id = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

    res.json(updatedUser);
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).semd('No  with that id');

    await User.findByIdAndRemove(id);

    res.json({User: ' deleted successfully'});
}

export const deleteAllUser = async(req,res) => {
    await User.deleteMany({});
    res.json({User: 'Deleted successfully'});
}

