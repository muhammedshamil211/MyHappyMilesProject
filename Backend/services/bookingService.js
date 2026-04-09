import * as bookingRepository from '../repositories/bookingRepository.js';

export const addBooking = async ({ userId, userName, packageId, phone, date, people, email, specialRequest, totalAmount }) => {
    try {
        const exist = await bookingRepository.findBookingByDetails(packageId, userId, date);

        if (exist) {
            return {
                status: 400,
                payload: { success: false, data: {}, message: "You already booked this package" }
            };
        }

        const booking = await bookingRepository.createBooking({
            userId,
            packageId,
            name: userName,
            phone,
            date,
            people: people || 1,
            count: people || 1,     // legacy alias
            email: email || "",
            specialRequest: specialRequest || "",
            totalAmount: totalAmount || 0,
        });

        return {
            status: 201,
            payload: { success: true, data: { booking }, message: "Booking successful" }
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            payload: { success: false, data: {}, message: 'Booking failed' }
        };
    }
};

export const getUserBookings = async (userId) => {
    try {
        const bookings = await bookingRepository.findUserBookings(userId);

        return {
            status: 200,
            payload: { success: true, data: { booking: bookings }, message: "Fetched successfully" }
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            payload: { success: false, data: {}, message: "Server error" }
        };
    }
};

export const cancelBookingService = async (bookingId, userId) => {
    try {
        const booking = await bookingRepository.findBookingById(bookingId);
        
        if (!booking) {
            return { status: 404, payload: { success: false, message: "Booking not found" } };
        }
        
        if (booking.userId._id.toString() !== userId.toString()) {
            return { status: 403, payload: { success: false, message: "Unauthorized to cancel this booking" } };
        }

        // Logic check: Allow cancellation ONLY if booking status is NOT confirmed OR travel date is at least 48 hours away
        const travelDate = new Date(booking.date);
        const now = new Date();
        const diffInHours = (travelDate - now) / (1000 * 60 * 60);

        if (booking.status === "confirmed" && diffInHours < 48) {
            return { status: 400, payload: { success: false, message: "Cannot cancel a confirmed booking within 48 hours of travel" } };
        }
        
        if (booking.status === "cancelled") {
            return { status: 400, payload: { success: false, message: "Booking is already cancelled" } };
        }

        const updatedBooking = await bookingRepository.updateBookingById(bookingId, { status: 'cancelled' });
        
        return {
            status: 200,
            payload: { success: true, data: { booking: updatedBooking }, message: "Booking cancelled successfully" }
        };
        
    } catch (error) {
        console.log(error);
        return { status: 500, payload: { success: false, message: "Server error during cancellation" } };
    }
};

export const getAllBookingsAdmin = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;
        const bookings = await bookingRepository.findAllBookings(skip, limit);
        const total = await bookingRepository.countAllBookings();
        
        return {
            status: 200,
            payload: { 
                success: true, 
                data: { bookings, total, page, totalPages: Math.ceil(total / limit) }, 
                message: "Fetched successfully" 
            }
        };
    } catch (error) {
        console.log(error);
        return { status: 500, payload: { success: false, message: "Server error" } };
    }
};

export const updateBookingStatusAdmin = async (bookingId, status, paymentStatus) => {
    try {
        const booking = await bookingRepository.findBookingById(bookingId);
        if (!booking) {
            return { status: 404, payload: { success: false, message: "Booking not found" } };
        }
        
        const updates = {};
        if (status) updates.status = status;
        if (paymentStatus) updates.paymentStatus = paymentStatus;

        const updatedBooking = await bookingRepository.updateBookingById(bookingId, updates);
        
        return { status: 200, payload: { success: true, data: { booking: updatedBooking }, message: "Booking updated successfully" } };
    } catch (error) {
        console.log(error);
        return { status: 500, payload: { success: false, message: "Server error" } };
    }
};
