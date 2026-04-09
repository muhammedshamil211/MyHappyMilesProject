import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import { getAdminBookings, updateAdminBookingStatus } from '../controllers/bookingController.js';

const adminBookingRouter = express.Router();

adminBookingRouter.get("/admin/bookings", authMiddleware, adminMiddleware, getAdminBookings);
adminBookingRouter.patch("/admin/bookings/:id/status", authMiddleware, adminMiddleware, updateAdminBookingStatus);

export default adminBookingRouter;
