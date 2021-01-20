import mongoose from 'mongoose'

const carSchema = mongoose.Schema({
    id: String,
    brand: String,
    model: String,
    year: Number,
})

const Cars = mongoose.model('Cars', carSchema);

export default Cars;

