import Cars from '../models/cars.js';
import mongoose from 'mongoose';

export const getCars = async(req, res) => {
    try{
        const cars = await Cars.find();

        res.status(200).json(cars);
    } catch (error) {
        res.status(404).json({Car: error.Car});
    }
}

export const getOneCar = async (req, res) => {
    const id = req.params.id

    try{
        const cars = await Cars.find({id: id}, function(err,obj) {
            //console.log(obj)
            if(err) console.log(err)
        } )

        res.status(200).json(cars);
    } catch ( error ) {
        res.status(404).json({Car: error.Car});
    }
}

export const createCar = async (req, res) => {
    const newCar = new Cars({
        id: req.body.id,
        brand: req.body.brand,
        model: req.body.model,
        year: req.body.year
    });

    try{
        await newCar.save();
        res.status(201).json(newCar);
    } catch (error) {
        res.status(409).json({Car: error.Car});
    }
}

export const updateCar = async (req, res) => {
    const id = req.params.id;
    const updatedCar = await Cars.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
        if(!data) {
            res.status(404).send({
                Car: `Cannot update Car with id:${id}. Maybe not found?`
            });
        } else res.send({Car: "Updated!"})
    }).catch(err => {
        res.status(500).send({
            Car: "Error updating id: " + id,
            error: err
        })
    });

    res.json(updatedCar);
}

export const deleteCar = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).semd('No Car with that id');

    await Cars.findByIdAndRemove(id);

    res.json({Car: 'Car deleted successfully'});
}

export const deleteAllCars = async(req,res) => {
    await Cars.deleteMany({});
    res.json({Car: 'Deleted successfully'});
}