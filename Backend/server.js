import authRouter from './routes/authRoutes.js';
import placeRouter from './routes/place.routes.js';
import packageRouter from './routes/package.routes.js';
import connectDB from './config/db.js';

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import bookingRouter from './routes/booking.route.js';
import adminBookingRouter from './routes/admin.booking.route.js';
import adminUserRouter from './routes/admin.user.route.js';
import reviewRouter from './routes/review.routes.js';
import adminReviewRouter from './routes/admin.review.route.js';

const app = express();

dotenv.config();
connectDB();

// Security Hardening Headers
app.use(helmet());

// Cross-origin & Cookies
// Must explicitly whitelist the frontend origin — `origin: true` is unreliable
// for credentialed requests (cookies). Browser rejects Set-Cookie if origin is a wildcard.
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL // production URL from .env
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Required: allows browser to send/receive cookies
}));
app.use(express.json());
app.use(cookieParser());

// Rate Limiting (High-Traffic prevention)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 20, // limit each IP to 20 auth calls
    message: { success: false, message: "Too many requests from this IP, please try again later" }
});

app.use("/api/v1/auth", authLimiter, authRouter);

app.use("/api/v1", placeRouter);

app.use("/api/v1", packageRouter);

app.use("/api/v1", bookingRouter);
app.use("/api/v1", adminBookingRouter);
app.use("/api/v1/admin/users", adminUserRouter);
app.use("/api/v1", reviewRouter);
app.use("/api/v1/admin", adminReviewRouter);
import analyticsRouter from './routes/admin.analytics.route.js';
app.use("/api/v1/admin/analytics", analyticsRouter);


app.get("/", (req, res) => {
    res.send("Server working");
});



const PORT = 5000;

app.listen(PORT, () => {
    console.log('Server is running on port: ', PORT);
});