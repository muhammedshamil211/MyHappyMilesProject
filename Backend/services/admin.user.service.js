import userModel from '../models/User.js';
import mongoose from 'mongoose';

/**
 * Advanced User Analytics Aggregation Pipeline
 * Calculates totalSpent and totalBookings natively per user.
 */
export const getAllUsersWithAnalytics = async (query = {}) => {
    try {
        const { search, page = 1, limit = 10, role, status } = query;
        
        // 1. Build initial match for User filtering (search, role, status)
        const matchStage = {};
        
        if (search) {
            matchStage.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (role) {
            matchStage.role = role;
        }
        
        if (status) {
            matchStage.status = status;
        }

        // Must not be deleted unless looking for them (defaults to false)
        matchStage.isDeleted = false;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitInt = parseInt(limit);

        // Core Aggregation Pipeline
        const pipeline = [
            { $match: matchStage },
            // Sort by creation date by default to stabilize pagination layer
            { $sort: { createdAt: -1 } },
            // Attach pagination skip/limit
            { $skip: skip },
            { $limit: limitInt },
            // Lookup bookings specific to this user
            {
                $lookup: {
                    from: 'bookings',
                    let: { userId: '$_id' },
                    pipeline: [
                        { $match: { 
                            $expr: { $eq: ['$userId', '$$userId'] },
                            status: 'confirmed' 
                        } },
                        { $group: {
                            _id: null,
                            totalBookings: { $sum: 1 },
                            totalSpent: { $sum: '$totalAmount' },
                            lastBookingDate: { $max: '$createdAt' }
                        }}
                    ],
                    as: 'analytics'
                }
            },
            // Unwind analytics to flatten Object
            { $unwind: { path: '$analytics', preserveNullAndEmptyArrays: true } },
            // Project final output gracefully
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    role: 1,
                    status: 1,
                    lastLogin: 1,
                    createdAt: 1,
                    totalBookings: { $ifNull: ['$analytics.totalBookings', 0] },
                    totalSpent: { $ifNull: ['$analytics.totalSpent', 0] },
                    lastBookingDate: '$analytics.lastBookingDate'
                }
            }
        ];

        const users = await userModel.aggregate(pipeline);
        
        // Count for total pages
        const totalUsers = await userModel.countDocuments(matchStage);

        return {
            status: 200,
            payload: {
                success: true,
                data: {
                    users,
                    pagination: {
                        totalUsers,
                        totalPages: Math.ceil(totalUsers / limitInt),
                        currentPage: parseInt(page),
                        limit: limitInt
                    }
                }
            }
        };
    } catch (error) {
        console.error("Aggregation Error", error);
        return { status: 500, payload: { success: false, message: 'Aggregation failed' } };
    }
};

/**
 * Best Users Ranking System via Database Aggregation Strategy
 * Ranks strictly by totalSpent first, then ties are broken by totalBookings natively
 */
export const getTopUsersRanking = async (limit = 5) => {
    try {
        const pipeline = [
            { $match: { isDeleted: false, role: 'user' } },
            {
                $lookup: {
                    from: 'bookings',
                    let: { userId: '$_id' },
                    pipeline: [
                        { $match: { 
                            $expr: { $eq: ['$userId', '$$userId'] },
                            status: 'confirmed' 
                        } },
                        { $group: {
                            _id: null,
                            totalBookings: { $sum: 1 },
                            totalSpent: { $sum: '$totalAmount' }
                        }}
                    ],
                    as: 'analytics'
                }
            },
            { $unwind: { path: '$analytics', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    totalBookings: { $ifNull: ['$analytics.totalBookings', 0] },
                    totalSpent: { $ifNull: ['$analytics.totalSpent', 0] }
                }
            },
            // The Ranking Algorithmic Step
            { $match: { totalBookings: { $gt: 0 } } }, // Only rank users who have actually booked something
            { $sort: { totalSpent: -1, totalBookings: -1 } },
            { $limit: parseInt(limit) }
        ];

        const rankedUsers = await userModel.aggregate(pipeline);
        
        // Inject rank metadata dynamically on post processing based off the absolute sorted order
        const rankedResponse = rankedUsers.map((user, idx) => ({
            rank: idx + 1,
            ...user
        }));

        return {
            status: 200,
            payload: { success: true, data: { topUsers: rankedResponse } }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, message: 'Ranking calculation failed' } };
    }
};

/**
 * Generic Patch Logic Updates Database Parameters like Roles / Status Limits cleanly 
 */
export const updateSystemUser = async (userId, updateFields) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
             return { status: 400, payload: { success: false, message: "Invalid user ID" } };
        }
        
        const user = await userModel.findById(userId);
        if (!user || user.isDeleted) {
            return { status: 404, payload: { success: false, message: "User not found" } };
        }

        // Iterate fields safely
        if (updateFields.status !== undefined) user.status = updateFields.status;
        if (updateFields.role !== undefined) user.role = updateFields.role;

        await user.save();

        return {
            status: 200,
            payload: { success: true, message: `User updated successfully`, user }
        };
    } catch (error) {
        return { status: 500, payload: { success: false, message: 'Status modification failed' } };
    }
};
