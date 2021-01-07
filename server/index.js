import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRoutes from './routes/messages.js';


const app = express();

app.use(bodyParser.json())

app.get('/', (req,res) => {
    res.send('Hello Hello');
  })



