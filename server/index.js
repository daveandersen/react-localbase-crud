import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import users from './routes/users.js'
import cars from './routes/cars.js'


const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}))
app.use(cors());

app.use('/users', users)
app.use('/cars', cars)

app.use(bodyParser.json())

app.get('/', (req,res) => {
    res.send({message: 'Connected to server!'});
    console.log("Connected to server");
})

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/localbase-crud', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);



