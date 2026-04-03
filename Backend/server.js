import authRouter from './routes/authRoutes.js';
import placeRouter from './routes/place.routes.js';
import packageRouter from './routes/package.routes.js';
import connectDB from './config/db.js';

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bookingRouter from './routes/booking.route.js';


const app = express();

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use("/api/v1", placeRouter);

app.use("/api/v1", packageRouter);

app.use("/api/v1", bookingRouter);



app.get("/", (req, res) => {
    res.send("Server working");
});



const PORT = 5000;

app.listen(PORT, () => {
    console.log('Server is running on port: ', PORT);
});