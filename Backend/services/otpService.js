import bcrypt from 'bcryptjs';
import OTP from '../models/OTP.js';

// Random 6 digit generator
const generateNumericCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (identifier, purpose) => {
    try {
        // Enforce rate limiting manually inside service: only 1 active exact OTP valid at a time
        // Alternatively, rely on express-rate-limit
        
        const code = generateNumericCode();
        const hash = await bcrypt.hash(code, 10);

        // 5 Minutes expiry
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Cancel previous active OTPs for this identifier+purpose
        await OTP.deleteMany({ identifier, purpose });

        const otpRecord = new OTP({
            identifier,
            purpose,
            otpHash: hash,
            expiresAt
        });

        await otpRecord.save();

        // MOCK EMAIL/SMS SEND (Integration point)
        console.log(`\n\n[MOCK ${purpose.toUpperCase()} OTP] Sent to: ${identifier}`);
        console.log(`[MOCK OTP] CODE: ${code}\n\n`);

        return { success: true, message: `OTP sent to ${identifier}` };
    } catch (error) {
        console.error("OTP Generation Error:", error);
        return { success: false, message: "Error generating OTP" };
    }
};

export const verifyOTP = async (identifier, code, purpose) => {
    try {
        const otpRecord = await OTP.findOne({ identifier, purpose });

        // Not found or expired
        if (!otpRecord) {
            return { success: false, message: "OTP not found or expired" };
        }

        // Check attempts limit (Max 3)
        if (otpRecord.attempts >= 3) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return { success: false, message: "Too many failed attempts. Request a new OTP." };
        }

        // Validate hash
        const isValid = await bcrypt.compare(code, otpRecord.otpHash);

        if (!isValid) {
            // Increment attempt constraint
            otpRecord.attempts += 1;
            await otpRecord.save();
            return { success: false, message: "Invalid OTP code" };
        }

        // Success -> purge the record to prevent reuse
        await OTP.deleteOne({ _id: otpRecord._id });
        return { success: true, message: "OTP Verified successfully" };

    } catch (error) {
        console.error("OTP Verification Error:", error);
        return { success: false, message: "Server error verifying OTP" };
    }
};
