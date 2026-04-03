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

export const getPackagesByPlaceId = async (placeId, page, limit) => {
    const skip = (page - 1) * limit;
    return await PackageModel.find({ placeId }).skip(skip).limit(limit);
};

export const countPackagesByPlaceId = async (placeId) => {
    return await PackageModel.countDocuments({ placeId });
};

export const getPackageByIdWithPlace = async (packageId) => {
    return await PackageModel.findById(packageId).populate("placeId");
};

/**
 * Update rich details fields on a package.
 */
export const updatePackageDetails = async (packageId, detailsData) => {
    return await PackageModel.findByIdAndUpdate(
        packageId,
        { $set: detailsData },
        { new: true, runValidators: true }
    );
};

/**
 * Toggle a like for a user on a package.
 * Returns the updated package.
 */
export const toggleLike = async (packageId, userId) => {
    const pkg = await PackageModel.findById(packageId);
    if (!pkg) return null;

    const hasLiked = pkg.likes.some(id => id.toString() === userId.toString());

    if (hasLiked) {
        // Remove like
        return await PackageModel.findByIdAndUpdate(
            packageId,
            { $pull: { likes: userId } },
            { new: true }
        );
    } else {
        // Add like
        return await PackageModel.findByIdAndUpdate(
            packageId,
            { $addToSet: { likes: userId } },
            { new: true }
        );
    }
};

/**
 * Fetch packages with complex filtering and sorting.
 */
export const getFilteredPackages = async ({
    search,
    placeId,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 10
}) => {
    const query = {};

    // 1. Filtering
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }
    if (placeId) {
        query.placeId = placeId;
    }
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 2. Sorting
    let sortOption = { createdAt: -1 }; // Default
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'popularity_desc') sortOption = { views: -1 };
    else if (sort === 'date_desc') sortOption = { createdAt: -1 };

    // 3. Pagination
    const skip = (page - 1) * limit;

    const packages = await PackageModel.find(query)
        .populate("placeId")
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

    const total = await PackageModel.countDocuments(query);

    return { packages, total };
};
