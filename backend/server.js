import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import authRoutes from './Routes/authRoutes.js'
import blogRoutes from './Routes/blogRoutes.js'
import categoryRoutes from './Routes/categoryRoutes.js'
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
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(morgan('dev'))

// routes
app.use('/api/auth',authRoutes)
app.use('/api/blog',blogRoutes )
app.use('/api/category',categoryRoutes)

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