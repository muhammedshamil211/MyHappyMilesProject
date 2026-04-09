import * as authService from '../services/authService.js';
import * as otpService from '../services/otpService.js';
import { verifyGoogleToken, processGoogleLogin } from '../services/googleAuth.js';
import RefreshToken from '../models/RefreshToken.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const { status, payload } = await authService.loginUser(email, password);

    // If successfully logged in, set HTTP-Only cookie for refresh token
    if (payload.success && payload.data.refreshToken) {
        res.cookie('refreshToken', payload.data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Remove refreshToken payload string from pure JSON response
        delete payload.data.refreshToken;
    }

    res.status(status).json(payload);
}

export const userRegister = async (req, res) => {
    const { name, email, password } = req.body;
    const { status, payload } = await authService.registerUser(name, email, password);
    res.status(status).json(payload);
}

export const userUpdate = async (req, res) => {
    const { name } = req.body;
    const { status, payload } = await authService.updateUserProfile(req.user.id, name);
    res.status(status).json(payload);
}

export const userDelete = async (req, res) => {
    const { email } = req.body;
    const { status, payload } = await authService.deleteUser(req.user.id, req.user.email, email);
    res.status(status).json(payload);
}

// ----------------------------------------------------- //
// NEW ENTERPRISE ROUTES
// ----------------------------------------------------- //

// ----------------------- GOOGLE ---------------------- //
export const googleAuthCallback = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "No token provided" });

    const tokenRes = await verifyGoogleToken(token);
    if (!tokenRes.success) return res.status(400).json({ success: false, message: tokenRes.message });

    const loginRes = await processGoogleLogin(tokenRes.data);
    if (!loginRes.success) return res.status(403).json({ success: false, message: loginRes.message });

    const { accessToken, refreshToken } = await authService.generateTokens(loginRes.user, req.ip);

    // Set cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        message: "Google Login successful",
        data: {
            token: accessToken,
            user: {
                id: loginRes.user._id,
                name: loginRes.user.name,
                email: loginRes.user.email,
                role: loginRes.user.role,
                isEmailVerified: loginRes.user.isEmailVerified
            }
        }
    });
};

// ------------------- SEND OTP ------------------- //
export const requestOTP = async (req, res) => {
    const { identifier, purpose } = req.body;
    // purpose: 'login' (mobile) or 'verify' (email verification)

    if (!identifier || !purpose) {
        return res.status(400).json({ success: false, message: "Missing identifier or purpose" });
    }

    const response = await otpService.sendOTP(identifier, purpose);
    res.status(response.success ? 200 : 400).json(response);
};

// --------------- VERIFY OTP (MOBILE) ------------ //
export const verifyMobileLoginOTP = async (req, res) => {
    const { identifier, code } = req.body;

    const otpRes = await otpService.verifyOTP(identifier, code, 'login');
    if (!otpRes.success) return res.status(400).json(otpRes);

    // If success, find or create Mobile User
    let user = await User.findOne({ phone: identifier });
    if (!user) {
        // Mobile-only register logic (they may setup a password later if they want)
        user = new User({
            name: 'User ' + identifier.slice(-4), // basic placeholder
            phone: identifier,
            role: 'user',
            isEmailVerified: false
        });
        await user.save();
    }

    if (user.isDeleted || user.status === 'blocked') {
        return res.status(403).json({ success: false, message: "Account is restricted." });
    }

    const { accessToken, refreshToken } = await authService.generateTokens(user, req.ip);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        message: "Mobile Login successful",
        data: {
            token: accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        }
    });
};

// --------------- VERIFY EMAIL OTP ---------------- //
export const verifyEmailOTP = async (req, res) => {
    // Accept email from body directly — used during post-registration flow
    // The user is NOT logged in yet, they just registered and need to verify
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ success: false, message: "Email and code are required" });
    }

    const otpRes = await otpService.verifyOTP(email, code, 'verify');
    if (!otpRes.success) return res.status(400).json(otpRes);

    const User = (await import('../models/User.js')).default;
    await User.findOneAndUpdate({ email }, { isEmailVerified: true });

    res.status(200).json({ success: true, message: "Email successfully verified! You can now log in." });
};

// --------------- TOKEN ROTATION & LOGOUT ---------------- //
export const refreshTokens = async (req, res) => {
    const rfToken = req.cookies.refreshToken;
    if (!rfToken) return res.status(401).json({ success: false, message: "No refresh token found" });

    // Validate if it exists in DB hashed
    const crypto = await import('crypto');
    const refreshHash = crypto.createHash('sha256').update(rfToken).digest('hex');

    const tokenRecord = await RefreshToken.findOne({ tokenHash: refreshHash }).populate('userId');
    if (!tokenRecord) {
        // Attack detected possibly, clear invalid cookie
        res.clearCookie('refreshToken');
        return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    const user = tokenRecord.userId;
    if (user.isDeleted || user.status === 'blocked') {
        res.clearCookie('refreshToken');
        return res.status(403).json({ success: false, message: "Account restricted" });
    }

    const { accessToken, refreshToken } = await authService.generateTokens(user, req.ip);

    // Old token was auto-deleted by generateTokens passing deviceFingerprint (req.ip)
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        success: true,
        data: {
            token: accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified
            }
        }
    });
};

export const logoutSession = async (req, res) => {
    const rfToken = req.cookies.refreshToken;

    if (rfToken) {
        try {
            const crypto = await import('crypto');
            const refreshHash = crypto.createHash('sha256').update(rfToken).digest('hex');
            await RefreshToken.deleteOne({ tokenHash: refreshHash });
        } catch (err) {
            console.error('Refresh token DB deletion failed:', err);
        }
    }

    // CRITICAL: clearCookie MUST use the EXACT same options used when setting the cookie.
    // If httpOnly, sameSite, secure, or path don't match, the browser ignores
    // the clear and the cookie persists, causing ghost auto-login.
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
};