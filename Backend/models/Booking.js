import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
        required: true
    },
    name: String,
    email: String,
    phone: {
        type: String,
        required: true
    },
    // people replaces the old `count` field
    people: {
        type: Number,
        default: 1
    },
    // Legacy alias
    count: {
        type: Number
    },
    date: String,
    specialRequest: {
        type: String,
        default: ""
    },
    totalAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const BookingModel = mongoose.model('Booking', bookingSchema);
export default BookingModel;