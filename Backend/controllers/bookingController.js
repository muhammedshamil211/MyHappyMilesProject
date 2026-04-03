import * as bookingService from '../services/bookingService.js';

export const addBooking = async (req, res) => {
    const { packageId, phone, date, people, count, email, specialRequest, totalAmount } = req.body;

    const { status, payload } = await bookingService.addBooking({
        userId: req.user.id,
        userName: req.user.name,
        packageId,
        phone,
        date,
        people: people || count || 1,
        email,
        specialRequest,
        totalAmount,
    });

    res.status(status).json(payload);
};

export const getBookings = async (req, res) => {
    const { status, payload } = await bookingService.getUserBookings(req.user.id);
    res.status(status).json(payload);
};