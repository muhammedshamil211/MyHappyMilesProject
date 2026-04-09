import express from 'express'
const authRouter = express.Router();
import {  
    userDelete, userLogin, userRegister, userUpdate, 
    googleAuthCallback, requestOTP, verifyMobileLoginOTP, 
    verifyEmailOTP, refreshTokens, logoutSession 
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Core Passwords
authRouter.post("/login", userLogin);
authRouter.post("/register", userRegister);

// Google OAuth
authRouter.post("/google", googleAuthCallback);

// OTP Flows
authRouter.post("/otp/send", requestOTP);
authRouter.post("/otp/verify/mobile", verifyMobileLoginOTP);
authRouter.post("/otp/verify/email", verifyEmailOTP); // Public — used right after registration

// Token / Session
authRouter.post("/refresh", refreshTokens);
authRouter.post("/logout", logoutSession);

// Profile mutations
authRouter.put("/edit",authMiddleware, userUpdate);
authRouter.delete("/edit" , authMiddleware, userDelete)

export default authRouter;