import * as analyticsRepository from '../repositories/analyticsRepository.js';

export const getGlobalPackageAnalytics = async (queryParams) => {
    try {
        const {
            search,
            sortBy = 'totalRevenue',
            order = 'desc',
            page = 1,
            limit = 10
        } = queryParams;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === 'asc' ? 1 : -1;

        const { data, total } = await analyticsRepository.getGlobalPackageAnalytics({
            search,
            sortBy,
            order: sortOrder,
            skip,
            limit: parseInt(limit)
        });

        const totalPages = Math.ceil(total / parseInt(limit));

        return {
            status: 200,
            payload: {
                success: true,
                data: {
                    packages: data,
                    pagination: {
                        total,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages,
                        hasNextPage: parseInt(page) < totalPages,
                        hasPrevPage: parseInt(page) > 1
                    }
                },
                message: "Fetched successfully"
            }
        };
    } catch (error) {
        console.error(error);
        return { status: 500, payload: { success: false, message: "Error fetching analytics" } };
    }
};

export const getPackageDetailedStats = async (packageId) => {
    try {
        const stats = await analyticsRepository.getPackageDetailedStats(packageId);
        
        if (!stats.summary) {
            return { status: 404, payload: { success: false, message: "Package not found" } };
        }

        return {
            status: 200,
            payload: {
                success: true,
                data: stats,
                message: "Fetched successfully"
            }
        };
    } catch (error) {
        console.error(error);
        return { status: 500, payload: { success: false, message: "Error fetching detailed analytics" } };
    }
};
