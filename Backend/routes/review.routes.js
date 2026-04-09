import express from 'express';
import { createOrUpdateReview, getPackageReviews, toggleLikeReview } from '../controllers/review.controller.js';
import { addReply } from '../controllers/reply.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Publicly accessible reads
router.get('/reviews/:packageId', getPackageReviews);

// Protected mutations
router.post('/reviews/:packageId', authMiddleware, createOrUpdateReview);
router.post('/reviews/:id/like', authMiddleware, toggleLikeReview);
router.post('/reviews/:reviewId/reply', authMiddleware, addReply);

export default router;
