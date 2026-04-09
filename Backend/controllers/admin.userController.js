import * as adminUserService from '../services/admin.user.service.js';

export const getAllUsersAnalytics = async (req, res) => {
    try {
        const { status, payload } = await adminUserService.getAllUsersWithAnalytics(req.query);
        res.status(status).json(payload);
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getTopUsersRanking = async (req, res) => {
    try {
        const limit = req.query.limit || 5;
        const { status, payload } = await adminUserService.getTopUsersRanking(limit);
        res.status(status).json(payload);
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { status: newStatus } = req.body;
        
        if (!['active', 'blocked'].includes(newStatus)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const { status, payload } = await adminUserService.updateSystemUser(userId, { status: newStatus });
        res.status(status).json(payload);
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;
        
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const { status, payload } = await adminUserService.updateSystemUser(userId, { role });
        res.status(status).json(payload);
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
