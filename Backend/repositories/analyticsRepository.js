import BookingModel from "../models/Booking.js";
import PackageModel from "../models/Package.js";
import ReviewModel from "../models/Review.js";
import mongoose from "mongoose";

/**
 * Aggregates analytics for all packages.
 * Includes total bookings, revenue, reviews, avg rating, views, and conversion rate.
 */
export const getGlobalPackageAnalytics = async ({ search, sortBy, order = -1, skip = 0, limit = 10 }) => {
    const matchQuery = {};
    if (search) {
        matchQuery.title = { $regex: search, $options: 'i' };
    }

    const pipeline = [
        // 1. Match search text if any
        { $match: matchQuery },
        
        // 2. Lookup Bookings
        {
            $lookup: {
                from: 'bookings',
                localField: '_id',
                foreignField: 'packageId',
                as: 'allBookings'
            }
        },
        
        // 3. Lookup Reviews
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'packageId',
                as: 'allReviews'
            }
        },
        
        // 4. Calculate stats
        {
            $project: {
                _id: 1,
                title: 1,
                views: { $ifNull: ["$views", 0] },
                totalBookings: {
                    $size: {
                        $filter: {
                            input: "$allBookings",
                            as: "b",
                            cond: { $eq: ["$$b.status", "confirmed"] }
                        }
                    }
                },
                totalRevenue: {
                    $sum: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$allBookings",
                                    as: "b",
                                    cond: { $eq: ["$$b.status", "confirmed"] }
                                }
                            },
                            as: "b",
                            in: "$$b.totalAmount"
                        }
                    }
                },
                totalReviews: { $size: "$allReviews" },
                averageRating: { $avg: "$allReviews.rating" }
            }
        },
        
        // 5. Calculate Conversion Rate
        {
            $addFields: {
                conversionRate: {
                    $cond: [
                        { $eq: ["$views", 0] },
                        0,
                        { $multiply: [{ $divide: ["$totalBookings", "$views"] }, 100] }
                    ]
                }
            }
        }
    ];

    // Total count for pagination
    const countResult = await PackageModel.aggregate([...pipeline, { $count: "total" }]);
    const total = countResult[0]?.total || 0;

    // Sorting
    const sortObj = {};
    if (sortBy) {
        sortObj[sortBy] = order;
    } else {
        sortObj.totalRevenue = -1; // Default
    }

    const data = await PackageModel.aggregate([
        ...pipeline,
        { $sort: sortObj },
        { $skip: skip },
        { $limit: limit }
    ]);

    return { data, total };
};

/**
 * Detailed analytics for a single package.
 */
export const getPackageDetailedStats = async (packageId) => {
    const pkgId = new mongoose.Types.ObjectId(packageId);

    // 1. Basic Stats & Summary
    const summary = await PackageModel.aggregate([
        { $match: { _id: pkgId } },
        {
            $lookup: {
                from: 'bookings',
                localField: '_id',
                foreignField: 'packageId',
                as: 'bookings'
            }
        },
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'packageId',
                as: 'reviews'
            }
        },
        {
            $project: {
                title: 1,
                views: 1,
                totalBookings: {
                    $size: {
                        $filter: {
                            input: "$bookings",
                            as: "b",
                            cond: { $eq: ["$$b.status", "confirmed"] }
                        }
                    }
                },
                totalRevenue: {
                    $sum: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$bookings",
                                    as: "b",
                                    cond: { $eq: ["$$b.status", "confirmed"] }
                                }
                            },
                            as: "b",
                            in: "$$b.totalAmount"
                        }
                    }
                },
                averageRating: { $avg: "$reviews.rating" },
                totalReviews: { $size: "$reviews" }
            }
        }
    ]);

    // 2. Sales & Revenue Over Time (Daily - Last 30 Days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timeSeries = await BookingModel.aggregate([
        {
            $match: {
                packageId: pkgId,
                status: 'confirmed',
                createdAt: { $gte: thirtyDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                bookings: { $sum: 1 },
                revenue: { $sum: "$totalAmount" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // 3. Rating Distribution
    const ratingDistribution = await ReviewModel.aggregate([
        { $match: { packageId: pkgId } },
        {
            $group: {
                _id: "$rating",
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    return {
        summary: summary[0] || null,
        timeSeries,
        ratingDistribution
    };
};
