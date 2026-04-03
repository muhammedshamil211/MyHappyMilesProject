import PackageModel from "../models/Package.js";

export const createPackage = async (packageData) => {
    return await PackageModel.create(packageData);
};

export const updatePackageById = async (packageId, updateData) => {
    return await PackageModel.findByIdAndUpdate(
        packageId,
        updateData,
        { new: true, runValidators: true }
    );
};

export const deletePackageById = async (packageId) => {
    return await PackageModel.findByIdAndDelete(packageId);
};

export const getRecentPackages = async (limit = 3) => {
    return await PackageModel.find().sort({ createdAt: -1 }).limit(limit);
};

export const getPopularPackages = async (limit = 3) => {
    return await PackageModel.find().sort({ views: -1 }).limit(limit);
};

export const incrementPackageViews = async (id) => {
    return await PackageModel.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
    );
};

export const getPackagesByPlaceId = async (placeId) => {
    return await PackageModel.find({ placeId });
};

export const getPackageByIdWithPlace = async (packageId) => {
    return await PackageModel.findById(packageId).populate("placeId");
};
