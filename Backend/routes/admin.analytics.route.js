import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import * as adminAnalyticsController from '../controllers/adminAnalyticsController.js';

const analyticsRouter = express.Router();

// All analytics routes require admin privileges
analyticsRouter.use(authMiddleware, adminMiddleware);

// GET /api/v1/admin/analytics/packages?search=...&sortBy=...&page=...
analyticsRouter.get('/packages', adminAnalyticsController.getGlobalAnalytics);

// GET /api/v1/admin/analytics/packages/:id
analyticsRouter.get('/packages/:id', adminAnalyticsController.getPackageStats);

export default analyticsRouter;
