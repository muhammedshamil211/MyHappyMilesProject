import * as analyticsService from '../services/analyticsService.js';

export const getGlobalAnalytics = async (req, res) => {
    const { status, payload } = await analyticsService.getGlobalPackageAnalytics(req.query);
    res.status(status).json(payload);
};

export const getPackageStats = async (req, res) => {
    const { status, payload } = await analyticsService.getPackageDetailedStats(req.params.id);
    res.status(status).json(payload);
};
