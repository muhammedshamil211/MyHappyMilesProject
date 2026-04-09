import express from 'express';
import { getAllReviews, updateReviewStatus, deleteReview } from '../controllers/admin.review.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = express.Router();

// All routes here should be protected and restrict to admin only
router.use(authMiddleware, adminMiddleware);

router.get('/reviews', getAllReviews);
router.patch('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);

export default router;
