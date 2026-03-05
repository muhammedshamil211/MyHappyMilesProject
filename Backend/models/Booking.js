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
    phone:{ 
        type: String,
        length:10,
        required:true
    },
    count:{
        type:Number,
        default:1
    },
    date: String
}, { timestamps: true });

const BookingModel = mongoose.model('Booking', bookingSchema);

export default BookingModel;