import express from 'express';
import * as adminUserController from '../controllers/admin.userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const router = express.Router();

// All routes require authentication AND admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Analytics list and pagination
router.get('/', adminUserController.getAllUsersAnalytics);

// Best ranking lists
router.get('/top', adminUserController.getTopUsersRanking);

// Patch modifiers
router.patch('/:id/status', adminUserController.updateUserStatus);
router.patch('/:id/role', adminUserController.updateUserRole);

export default router;
