import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter valid email"
        ]
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        default: "user"
    },
    updateCount: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
});

const userModel = mongoose.model("User", userSchema);
export default userModel;