import * as packageRepository from '../repositories/packageRepository.js';

const DEFAULT_LIMIT = 6;

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
            images: image ? [image] : [],
            image, // legacy alias
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
            payload: { success: true, data: { package: updatedPackage }, message: "Package updated successfully" }
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

        return { status: 200, payload: { success: true, data: {}, message: "Package deleted successfully" } };
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

export const getPackageList = async (placeId, page = 1, limit = DEFAULT_LIMIT) => {
    try {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || DEFAULT_LIMIT;

        const packages = await packageRepository.getPackagesByPlaceId(placeId, pageNum, limitNum);
        const total = await packageRepository.countPackagesByPlaceId(placeId);
        const totalPages = Math.ceil(total / limitNum);

        const pagination = {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
        };

        return {
            status: 200,
            payload: { success: true, data: { packages, pagination }, message: "Fetched successfully" }
        };
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

        return { status: 200, payload: { success: true, data: { package: pack }, message: "Fetched successfully" } };
    } catch (error) {
        return { status: 500, payload: { success: false, data: {}, message: "Failed to fetch package details" } };
    }
};

export const updatePackageDetails = async (packageId, detailsData) => {
    try {
        const updated = await packageRepository.updatePackageDetails(packageId, detailsData);

        if (!updated) {
            return { status: 404, payload: { success: false, data: {}, message: "Package not found" } };
        }

        return {
            status: 200,
            payload: { success: true, data: { package: updated }, message: "Package details updated successfully" }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, data: {}, message: "Failed to update details" } };
    }
};

export const toggleLike = async (packageId, userId) => {
    try {
        const updated = await packageRepository.toggleLike(packageId, userId);

        if (!updated) {
            return { status: 404, payload: { success: false, data: {}, message: "Package not found" } };
        }

        const liked = updated.likes.some(id => id.toString() === userId.toString());

        return {
            status: 200,
            payload: {
                success: true,
                data: { liked, likesCount: updated.likes.length },
                message: liked ? "Package liked" : "Package unliked"
            }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, data: {}, message: "Server error" } };
    }
};

export const getAllPackages = async (queryParams) => {
    try {
        const {
            search,
            placeId,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 12
        } = queryParams;

        // Ensure defaults and basic cleaning
        const requestedPage = parseInt(page) || 1;
        const requestedLimit = parseInt(limit) || 12;

        const { packages, total } = await packageRepository.getFilteredPackages({
            search,
            placeId,
            minPrice,
            maxPrice,
            sort,
            page: requestedPage,
            limit: requestedLimit
        });

        const totalPages = Math.ceil(total / requestedLimit);

        const pagination = {
            total,
            page: requestedPage,
            limit: requestedLimit,
            totalPages,
            hasNextPage: requestedPage < totalPages,
            hasPrevPage: requestedPage > 1,
        };

        return {
            status: 200,
            payload: { success: true, data: { packages, pagination }, message: "Fetched successfully" }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, data: {}, message: "Server error" } };
    }
};
