import * as bookingRepository from '../repositories/bookingRepository.js';

export const addBooking = async (userId, userName, packageId, phone, date, count) => {
    try {
        const exist = await bookingRepository.findBookingByDetails(packageId, userId, date);

        if (exist) {
            return {
                status: 400,
                payload: {
                    success: false,
                    message: "You already booked this package"
                }
            };
        }

        const booking = await bookingRepository.createBooking({
            userId,
            packageId,
            name: userName,
            phone,
            date,
            count
        });

        return {
            status: 201,
            payload: {
                success: true,
                message: "Booking successful",
                booking
            }
        };

    } catch (error) {
        console.log(error);
        return {
            status: 500,
            payload: {
                success: false,
                message: 'Booking failed'
            }
        };
    }
};

export const getUserBookings = async (userId) => {
    try {
        const booking = await bookingRepository.findUserBookings(userId);

        return {
            status: 200,
            payload: {
                success: true,
                booking
            }
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            payload: { success: false }
        };
    }
};
