import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import {
    getPackageList,
    getPackageDetails,
    addPackage,
    updatePackage,
    deletePackage,
    recentPack,
    popularPack,
    incView,
    updatePackageDetails,
    toggleLike,
    getAllPackages
} from '../controllers/packageController.js'

const packageRouter = express.Router();

// Public generic search & filters
packageRouter.get("/packages/all", getAllPackages);

// Admin CRUD
packageRouter.post("/packages", authMiddleware, adminMiddleware, addPackage);
packageRouter.put("/packages/:packageId", authMiddleware, adminMiddleware, updatePackage);
packageRouter.delete("/packages/:packageId", authMiddleware, adminMiddleware, deletePackage);

// Admin — rich details editor
packageRouter.put("/packages/:packageId/details", authMiddleware, adminMiddleware, updatePackageDetails);

// Public reads
packageRouter.get("/packages/recent", recentPack);
packageRouter.get("/packages/popular", popularPack);
packageRouter.put('/packages/view/:id', incView);
packageRouter.get("/packages/:placeId", getPackageList);
packageRouter.get("/package/:packageId", getPackageDetails);

// Like toggle (auth user)
packageRouter.post("/packages/:packageId/like", authMiddleware, toggleLike);

export default packageRouter;
