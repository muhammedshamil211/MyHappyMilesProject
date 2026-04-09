import Review from "../models/Review.js";
import Reply from "../models/Reply.js";
import Package from "../models/Package.js";
import mongoose from "mongoose";

// Recalculation logic reused for deletions/hiding metrics
const updatePackageRating = async (packageId) => {
    try {
        const stats = await Review.aggregate([
            {
                $match: {
                    packageId: new mongoose.Types.ObjectId(packageId),
                    status: 'active'
                }
            },
            {
                $group: {
                    _id: "$packageId",
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            await Package.findByIdAndUpdate(packageId, {
                averageRating: Math.round(stats[0].averageRating * 10) / 10,
                totalReviews: stats[0].totalReviews
            });
        } else {
            await Package.findByIdAndUpdate(packageId, {
                averageRating: 0,
                totalReviews: 0
            });
        }
    } catch (error) {
        console.error("Error updating package rating:", error);
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status; // optional filter

        let matchQuery = {};
        if (status && status !== 'all') {
            matchQuery.status = status;
        }

        const skip = (page - 1) * limit;

        const reviews = await Review.find(matchQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name email profilePic')
            .populate('packageId', 'title')
            .lean();

        const total = await Review.countDocuments(matchQuery);

        res.status(200).json({
            success: true,
            data: {
                reviews,
                pagination: {
                    total,
                    page,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error("Admin fetch reviews error:", error);
        res.status(500).json({ success: false, message: "Server error fetching all reviews" });
    }
};

export const updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['active', 'hidden', 'reported'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
        
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Must recalculate the ratings, since hidden/reported shouldn't count towards averages.
        await updatePackageRating(review.packageId);

        res.status(200).json({ success: true, message: `Review status changed to ${status}`, data: review });
    } catch (error) {
        console.error("Update review status error:", error);
        res.status(500).json({ success: false, message: "Server error updating status" });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        const packageId = review.packageId;

        // Delete the explicit review
        await Review.findByIdAndDelete(id);

        // Delete all dangling replies related to this review sequentially
        await Reply.deleteMany({ reviewId: id });

        // Update package metric caches
        await updatePackageRating(packageId);

        res.status(200).json({ success: true, message: "Review and nested replies deleted successfully" });
    } catch (error) {
        console.error("Delete review error:", error);
        res.status(500).json({ success: false, message: "Server error deleting review" });
    }
};
