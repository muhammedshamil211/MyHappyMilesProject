import authRouter from './routes/authRoutes.js';
import placeRouter from './routes/place.routes.js';
import packageRouter from './routes/package.routes.js';
import connectDB from './config/db.js';

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookingRouter from './routes/booking.route.js';
import adminBookingRouter from './routes/admin.booking.route.js';
import adminUserRouter from './routes/admin.user.route.js';
import reviewRouter from './routes/review.routes.js';
import adminReviewRouter from './routes/admin.review.route.js';

const app = express();

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use("/api/v1", placeRouter);

app.use("/api/v1", packageRouter);

app.use("/api/v1", bookingRouter);
app.use("/api/v1", adminBookingRouter);
app.use("/api/v1/admin/users", adminUserRouter);
app.use("/api/v1", reviewRouter);
app.use("/api/v1/admin", adminReviewRouter);


app.get("/", (req, res) => {
    res.send("Server working");
});



const PORT = 5000;

app.listen(PORT, () => {
    console.log('Server is running on port: ', PORT);
});