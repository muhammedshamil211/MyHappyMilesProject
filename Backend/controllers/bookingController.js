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

export const cancelBooking = async (req, res) => {
    const { id } = req.params;
    const { status, payload } = await bookingService.cancelBookingService(id, req.user.id);
    res.status(status).json(payload);
};

export const getAdminBookings = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { status, payload } = await bookingService.getAllBookingsAdmin(Number(page), Number(limit));
    res.status(status).json(payload);
};

export const updateAdminBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { bookingStatus, paymentStatus } = req.body; // Map from frontend state
    
    // In our model it's "status".
    const mappedStatus = bookingStatus || req.body.status;
    
    const { status, payload } = await bookingService.updateBookingStatusAdmin(id, mappedStatus, paymentStatus);
    res.status(status).json(payload);
};