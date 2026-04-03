import BookingModel from "../models/Booking.js";

export const findBookingByDetails = async (packageId, userId, date) => {
    return await BookingModel.findOne({
        packageId,
        userId,
        date
    });
};

export const createBooking = async (bookingData) => {
    return await BookingModel.create(bookingData);
};

export const findUserBookings = async (userId) => {
    return await BookingModel.find({ userId })
        .select("count date packageId")
        .populate({
            path: "packageId",
            select: "title price placeId",
            populate: {
                path: "placeId",
                select: "name"
            }
        });
};
