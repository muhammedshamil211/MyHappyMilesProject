import * as bookingService from '../services/bookingService.js';

export const addBooking = async (req, res) => {
    const { packageId, phone, date, count } = req.body;
    
    const { status, payload } = await bookingService.addBooking(
        req.user.id,
        req.user.name,
        packageId,
        phone,
        date,
        count
    );
    
    res.status(status).json(payload);
};

export const getBookings = async (req, res) => {
    const { status, payload } = await bookingService.getUserBookings(req.user.id);
    
    res.status(status).json(payload);
};