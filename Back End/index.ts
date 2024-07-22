import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import employeeRoutes from './routes/employee';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT;

// Connect to MongoDB
mongoose.connect(process.env.PRIMARY_DB_URL!);
mongoose.connection.on("connected",() => {console.log("MongoDB Connected")})

// Middleware
app.use(bodyParser.json());
app.use(cors({origin:process.env.FRONT_END_URL!}))

// Routes
app.use('/api', employeeRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
