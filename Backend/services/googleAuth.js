import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

// Requires GOOGLE_CLIENT_ID in .env, falling back if dev env isn't fully configured
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'MOCK_ID');
console.log(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken) => {
    try {
        // Warning: This throws if GOOGLE_CLIENT_ID is invalid/mock
        // Ideally handled carefully in dev vs prod
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        
        return {
            success: true,
            data: {
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                profilePic: payload.picture
            }
        };
    } catch (error) {
        console.error("Google Auth Validation Error:", error);
        return { success: false, message: "Invalid Google Token" };
    }
};

export const processGoogleLogin = async (googleUserPayload) => {
    const { googleId, email, name } = googleUserPayload;

    // Check if user exists by email or googleId
    // Some users might have registered with email manually before using Google
    let user = await User.findOne({ 
        $or: [ { googleId }, { email } ] 
    });

    if (user) {
        // Link googleId if they originally registered with email
        if (!user.googleId) {
            user.googleId = googleId;
            user.isEmailVerified = true; // Google inherently verifies emails
            await user.save();
        }

        if (user.isDeleted || user.status === 'blocked') {
            return { success: false, message: "Account is restricted." };
        }

    } else {
        // New user registration flow
        user = new User({
            name,
            email,
            googleId,
            isEmailVerified: true,
            role: 'user'
        });
        await user.save();
    }

    return { success: true, user };
};
