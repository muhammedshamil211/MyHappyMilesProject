import BookingModel from "../models/Booking.js";

export const findBookingByDetails = async (packageId, userId, date) => {
    return await BookingModel.findOne({ packageId, userId, date });
};

export const createBooking = async (bookingData) => {
    return await BookingModel.create(bookingData);
};

export const findUserBookings = async (userId) => {
    return await BookingModel.find({ userId })
        .select("people count date packageId totalAmount status paymentStatus")
        .populate({
            path: "packageId",
            select: "title pricePerPerson price placeId images image",
            populate: {
                path: "placeId",
                select: "name"
            }
        });
};

export const findBookingById = async (bookingId) => {
    return await BookingModel.findById(bookingId).populate({
        path: "packageId",
        select: "title"
    }).populate({
         path: "userId",
         select: "name email phone"
    });
};

export const updateBookingById = async (bookingId, updateData) => {
    return await BookingModel.findByIdAndUpdate(bookingId, updateData, { new: true });
};

export const findAllBookings = async (skip = 0, limit = 10) => {
    return await BookingModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({
            path: "packageId",
            select: "title"
        })
        .populate({
            path: "userId",
            select: "name email phone"
        });
};

export const countAllBookings = async () => {
    return await BookingModel.countDocuments();
};
