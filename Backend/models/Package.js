import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,

    // Reverting to 'price' as the canonical field as per user request
    price: {
        type: Number,
        required: true,
        default: 0
    },

    duration: {
        type: String,
        required: true
    },

    // Upgraded: array of image URLs
    images: {
        type: [String],
        default: []
    },
    // Legacy alias kept for backward compat
    image: {
        type: String
    },

    // Rich content fields
    highlights: {
        type: [String],
        default: []
    },
    itinerary: [
        {
            day: Number,
            title: String,
            description: String
        }
    ],
    inclusions: {
        type: [String],
        default: []
    },
    exclusions: {
        type: [String],
        default: []
    },
    maxPeople: {
        type: Number,
        default: 20
    },

    // Like system
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    views: {
        type: Number,
        default: 0
    },

    // Review System Tracking
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const PackageModel = mongoose.model("Package", packageSchema);
export default PackageModel;