import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import { getPackageList, getPackageDetails, addPackage, updatePackage, deletePackage, recentPack, popularPack, incView } from '../controllers/packageController.js'

const packageRouter = express.Router();


packageRouter.post("/packages", authMiddleware, adminMiddleware, addPackage);
packageRouter.put("/packages/:packageId", authMiddleware, adminMiddleware, updatePackage);
packageRouter.delete("/packages/:packageId", authMiddleware, adminMiddleware, deletePackage);
packageRouter.get("/packages/recent", recentPack);
packageRouter.get("/packages/popular", popularPack);
// routes/packageRoutes.js

packageRouter.put('/packages/view/:id', incView);
packageRouter.get("/packages/:placeId", getPackageList);
packageRouter.get("/detailes/:packageId", getPackageDetails);

export default packageRouter;
