import express from 'express';

import { getCars, getOneCar, createCar, updateCar, deleteCar, deleteAllCars } from '../controllers/cars.js'

const router = express.Router();

router.get('/', getCars);
router.get('/:id', getOneCar)
router.post('/', createCar);
router.patch('/:id', updateCar);
router.delete('/:id', deleteCar);
router.delete('/', deleteAllCars)


export default router;