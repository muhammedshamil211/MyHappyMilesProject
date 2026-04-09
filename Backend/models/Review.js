import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    likesCount: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    status: {
        type: String,
        enum: ['active', 'hidden', 'reported'],
        default: 'active'
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Optional: ensure only 1 review per package per user, but doing logic manually is safer for updates.

const Review = mongoose.model("Review", reviewSchema);
export default Review;
