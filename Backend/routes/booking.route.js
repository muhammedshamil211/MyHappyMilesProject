
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addBooking, getBookings } from '../controllers/bookingController.js';
const bookingRouter = express.Router();


bookingRouter.post("/booking",authMiddleware, addBooking);

bookingRouter.get("/my-booking", authMiddleware, getBookings)

export default bookingRouter;