import BookingModel from "../models/Booking.js";

export const findBookingByDetails = async (packageId, userId, date) => {
    return await BookingModel.findOne({ packageId, userId, date });
};

export const createBooking = async (bookingData) => {
    return await BookingModel.create(bookingData);
};

export const findUserBookings = async (userId) => {
    return await BookingModel.find({ userId })
        .select("people count date packageId totalAmount")
        .populate({
            path: "packageId",
            select: "title pricePerPerson price placeId images image",
            populate: {
                path: "placeId",
                select: "name"
            }
        });
};
