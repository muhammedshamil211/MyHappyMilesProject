import express from 'express'
const authRouter = express.Router();
import {  userDelete, userLogin, userRegister, userUpdate } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';


authRouter.post("/login", userLogin);

authRouter.post("/register",userRegister);

authRouter.put("/edit",authMiddleware, userUpdate);

authRouter.delete("/edit" , authMiddleware, userDelete)

export default authRouter;