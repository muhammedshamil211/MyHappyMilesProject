import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows null/missing email for mobile-only users
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter valid email"
        ]
    },
    phone: {
        type: String,
        sparse: true,
        index: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        sparse: true,
        index: true
    },
    password: {
        type: String,
        select: false // Only required for manual email/password auth 
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    },
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active'
    },
    lastLogin: {
        type: Date,
        default: null
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
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);
export default userModel;