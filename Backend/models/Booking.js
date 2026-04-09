import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
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
    people: {
        type: Number,
        default: 1
    },
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
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
        index: true
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    }
}, { timestamps: true });

const BookingModel = mongoose.model('Booking', bookingSchema);
export default BookingModel;