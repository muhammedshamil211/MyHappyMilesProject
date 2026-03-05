import BookingModel from "../models/Booking.js";


export const addBooking = async (req, res) => {
    try {

        const { packageId, phone, date, count } = req.body;

    
        const exist = await BookingModel.findOne({
            packageId,
            userId: req.user.id,
            date
        });

        if (exist) {
            return res.status(400).json({
                success: false,
                message: "You already booked this package"
            });
        }

        const booking = await BookingModel.create({
            userId: req.user.id,
            packageId,
            name: req.user.name,
            phone,
            date,
            count
        });

        res.status(201).json({
            success: true,
            message: "Booking successful",
            booking
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Booking failed'
        });
    }
};


export const getBookings = async (req, res) => {
    try {
        const booking = await BookingModel.find({ userId: req.user.id })
            .select("count date packageId")
            .populate({
                path: "packageId",
                select: "title price placeId",
                populate: {
                    path: "placeId",
                    select: "name"
                }
            });

        res.json({
            success: true,
            booking
        });
    } catch (error) {
        console.log(err);
        res.status(500).json({ success: false });
    }
}