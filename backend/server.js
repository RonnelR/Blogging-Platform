import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import authRoutes from './Routes/authRoutes.js'
import { databaseConn } from './Cofig/db.js';
import cors from 'cors';
import morgan from 'morgan';

//config dotenv & colors
dotenv.config({ debug: true });
colors.enable();

// database connection
databaseConn();

// rest object
const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'))

// routes
app.use('/api/auth',authRoutes)

// PORT
const PORT = process.env.PORT;

//rest api
app.get('/',(req,res)=>{
    res.json('Welcome to Blogging Platform');
}); 

// server
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`.bgYellow.red);
});