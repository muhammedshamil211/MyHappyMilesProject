import * as packageRepository from '../repositories/packageRepository.js';

export const addPackage = async (placeId, title, description, price, duration, image) => {
    try {
        if (!placeId || !title || !price) {
            return { status: 400, payload: { success: false, data: {}, message: "Required fields missing" } };
        }

        const pack = await packageRepository.createPackage({
            placeId,
            title,
            description,
            price,
            duration,
            image
        });

        return {
            status: 201,
            payload: { success: true, data: { package: pack }, message: "Package added successfully" }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, data: {}, message: "Failed to add package" } };
    }
};

export const updatePackage = async (packageId, updateData) => {
    try {
        const updatedPackage = await packageRepository.updatePackageById(packageId, updateData);

        if (!updatedPackage) {
            return { status: 404, payload: { success: false, data: {}, message: "No package Found" } };
        }

        return {
            status: 200,
            payload: { success: true, data: { updatePackage: updatedPackage }, message: "Package updated successfully" }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, data: {}, message: "Server error" } };
    }
};

export const deletePackage = async (packageId) => {
    try {
        const deletedPackage = await packageRepository.deletePackageById(packageId);

        if (!deletedPackage) {
            return { status: 404, payload: { success: false, data: {}, message: "Package not found" } };
        }

        return {
            status: 200,
            payload: { success: true, data: {}, message: "Package deleted successfully" }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, data: {}, message: "Server error" } };
    }
};

export const recentPack = async () => {
    const packages = await packageRepository.getRecentPackages();
    return { status: 200, payload: { success: true, data: { packages }, message: "Fetched successfully" } };
};

export const popularPack = async () => {
    const packages = await packageRepository.getPopularPackages();
    return { status: 200, payload: { success: true, data: { packages }, message: "Fetched successfully" } };
};

export const incView = async (id) => {
    try {
        const updatedPackage = await packageRepository.incrementPackageViews(id);

        if (!updatedPackage) {
            return { status: 404, payload: { success: false, data: {}, message: "Package not found" } };
        }

        return { status: 200, payload: { success: true, data: { views: updatedPackage.views }, message: "Views incremented" } };
    } catch (err) {
        return { status: 500, payload: { success: false, data: { error: err.message }, message: "Server error" } };
    }
};

export const getPackageList = async (placeId) => {
    try {
        const packages = await packageRepository.getPackagesByPlaceId(placeId);
        return { status: 200, payload: { success: true, data: { packages }, message: "Fetched successfully" } };
    } catch (error) {
        return { status: 500, payload: { success: false, data: {}, message: "Server error" } };
    }
};

export const getPackageDetails = async (packageId) => {
    try {
        const pack = await packageRepository.getPackageByIdWithPlace(packageId);

        if (!pack) {
            return { status: 404, payload: { success: false, data: {}, message: "Package not found" } };
        }

        return { status: 200, payload: { success: true, data: pack, message: "Fetched successfully" } };
    } catch (error) {
        return { status: 500, payload: { success: false, data: {}, message: "Failed to fetch package details" } };
    }
};
