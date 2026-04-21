import dotenv from 'dotenv';
dotenv.config();

import authRouter from './routes/authRoutes.js';
import placeRouter from './routes/place.routes.js';
import packageRouter from './routes/package.routes.js';
import connectDB from './config/db.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import bookingRouter from './routes/booking.route.js';
import adminBookingRouter from './routes/admin.booking.route.js';
import adminUserRouter from './routes/admin.user.route.js';
import reviewRouter from './routes/review.routes.js';
import adminReviewRouter from './routes/admin.review.route.js';

const app = express();

// dotenv.config(); // Moved to top
connectDB();

// Diagnostic Middleware: Log origin to debug CORS
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        console.log(`Incoming request from origin: ${origin}`);
    }
    next();
});

// Cross-origin & Cookies
// Must explicitly whitelist the frontend origin — `origin: true` is unreliable
// for credentialed requests (cookies). Browser rejects Set-Cookie if origin is a wildcard.
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    "https://my-happymiles-project.vercel.app" // production URL from .env
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Security Hardening Headers - Configured to allow Cross-Origin
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
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



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server is running on port: ', PORT);
});

// Final Catch-all Error Handler (Must be last)
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    
    // Ensure CORS headers are present even on errors
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app'))) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});