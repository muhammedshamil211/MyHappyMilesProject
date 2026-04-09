import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    // Optional scaling for deeper nesting
    parentReplyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
        default: null
    }
}, { timestamps: true });

const Reply = mongoose.model("Reply", replySchema);
export default Reply;
