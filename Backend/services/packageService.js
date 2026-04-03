import * as packageRepository from '../repositories/packageRepository.js';

export const addPackage = async (placeId, title, description, price, duration, image) => {
    try {
        if (!placeId || !title || !price) {
            return { status: 400, payload: { message: "Required fields missing" } };
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
            payload: { success: true, message: "Package added successfully", package: pack }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, message: "Failed to add package" } };
    }
};

export const updatePackage = async (packageId, updateData) => {
    try {
        const updatedPackage = await packageRepository.updatePackageById(packageId, updateData);

        if (!updatedPackage) {
            return { status: 404, payload: { success: false, message: "No package Found" } };
        }

        return {
            status: 200,
            payload: { success: true, message: "Package updated successfully", updatePackage: updatedPackage }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, message: "Server error" } };
    }
};

export const deletePackage = async (packageId) => {
    try {
        const deletedPackage = await packageRepository.deletePackageById(packageId);

        if (!deletedPackage) {
            return { status: 404, payload: { success: false, message: "Package not found" } };
        }

        return {
            status: 200,
            payload: { success: true, message: "Package deleted successfully" }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, message: "Server error" } };
    }
};

export const recentPack = async () => {
    const packages = await packageRepository.getRecentPackages();
    return { status: 200, payload: { success: true, packages } };
};

export const popularPack = async () => {
    const packages = await packageRepository.getPopularPackages();
    return { status: 200, payload: { success: true, packages } };
};

export const incView = async (id) => {
    try {
        const updatedPackage = await packageRepository.incrementPackageViews(id);

        if (!updatedPackage) {
            return { status: 404, payload: { success: false, message: "Package not found" } };
        }

        return { status: 200, payload: { success: true, views: updatedPackage.views } };
    } catch (err) {
        return { status: 500, payload: { success: false, error: err.message } };
    }
};

export const getPackageList = async (placeId) => {
    try {
        const packages = await packageRepository.getPackagesByPlaceId(placeId);
        return { status: 200, payload: { success: true, packages } };
    } catch (error) {
        return { status: 500, payload: { success: false, message: "Server error" } };
    }
};

export const getPackageDetails = async (packageId) => {
    try {
        const pack = await packageRepository.getPackageByIdWithPlace(packageId);

        if (!pack) {
            return { status: 404, payload: { message: "Package not found" } };
        }

        return { status: 200, payload: pack };
    } catch (error) {
        return { status: 500, payload: { message: "Failed to fetch package details" } };
    }
};
