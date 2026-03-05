import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
        required: true
    }, title: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    views:{
        type:Number,
        default:0
    }
}, { timestamps: true }
)

const PackageModel = mongoose.model("Package", packageSchema);

export default PackageModel;