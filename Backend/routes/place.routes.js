import { addPlace, deletPlace, editPlace, getPlace } from '../controllers/placeController.js';
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

import express from 'express';
const placeRouter = express.Router();

placeRouter.get("/places", getPlace);

placeRouter.post("/places",
    authMiddleware,
    adminMiddleware,
    addPlace
);

placeRouter.put(
    "/places/:id",
    authMiddleware,
    adminMiddleware,
    editPlace
)

placeRouter.delete("/places/:id",
    authMiddleware,
    adminMiddleware,
    deletPlace
)


export default placeRouter;


