import * as packageService from '../services/packageService.js';

export const addPackage = async (req, res) => {
    const { placeId, title, description, price, duration, image } = req.body;
    const { status, payload } = await packageService.addPackage(
        placeId, title, description, price, duration, image
    );
    res.status(status).json(payload);
};

export const updatePackage = async (req, res) => {
    const { status, payload } = await packageService.updatePackage(req.params.packageId, req.body);
    res.status(status).json(payload);
};

export const deletePackage = async (req, res) => {
    const { status, payload } = await packageService.deletePackage(req.params.packageId);
    res.status(status).json(payload);
};

export const recentPack = async (req, res) => {
    const { status, payload } = await packageService.recentPack();
    res.status(status).json(payload);
};

export const popularPack = async (req, res) => {
    const { status, payload } = await packageService.popularPack();
    res.status(status).json(payload);
};

export const incView = async (req, res) => {
    const { status, payload } = await packageService.incView(req.params.id);
    res.status(status).json(payload);
};

export const getPackageList = async (req, res) => {
    const { page = 1, limit = 6, sortBy = 'newest' } = req.query;
    const { status, payload } = await packageService.getPackageList(req.params.placeId, page, limit, sortBy);
    res.status(status).json(payload);
};

export const getPackageDetails = async (req, res) => {
    const { status, payload } = await packageService.getPackageDetails(req.params.packageId);
    res.status(status).json(payload);
};

export const updatePackageDetails = async (req, res) => {
    const { status, payload } = await packageService.updatePackageDetails(req.params.packageId, req.body);
    res.status(status).json(payload);
};

export const toggleLike = async (req, res) => {
    const { status, payload } = await packageService.toggleLike(req.params.packageId, req.user.id);
    res.status(status).json(payload);
};

export const getAllPackages = async (req, res) => {
    try {
        const result = await packageService.getAllPackages(req.query);
        res.status(result.status).json(result.payload);
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};