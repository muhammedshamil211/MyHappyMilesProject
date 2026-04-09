import jwt from "jsonwebtoken";
import userModel from '../models/User.js';

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({
                message: "No token, access denied"
            });
        }

        const token = authHeader.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Verify the user is still active in the database
        const user = await userModel.findById(decode.id).select('status isDeleted');
        
        if (!user || user.isDeleted || user.status === 'blocked') {
            return res.status(403).json({
                message: "Access denied. Account is blocked or deleted."
            });
        }

        req.user = decode;

        next();

    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

export default authMiddleware;