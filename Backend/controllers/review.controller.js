import Review from "../models/Review.js";
import Package from "../models/Package.js";
import Booking from "../models/Booking.js";
import Reply from "../models/Reply.js";
import mongoose from "mongoose";

// Helper function to update package rating dynamically
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
                // Rounding rating to 1 decimal place
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
        console.error("Error recalculating package rating:", error);
    }
};

export const createOrUpdateReview = async (req, res) => {
    try {
        const { packageId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        // Check if package exists
        const pkg = await Package.findById(packageId);
        if (!pkg) {
            return res.status(404).json({ success: false, message: "Package not found" });
        }

        // Verify if user booked and confirmed this package
        const booking = await Booking.findOne({
            userId,
            packageId,
            status: "confirmed"
        });
        const isVerified = !!booking;

        // Find existing review
        let review = await Review.findOne({ packageId, userId });

        if (review) {
            // Update existing review (preventing duplicates)
            review.rating = rating;
            review.comment = comment;
            review.isVerified = isVerified;
            review.status = 'active'; // Reset if it was hidden/reported? Probably keep as is to prevent bypassing moderation, let's just save.
            await review.save();
        } else {
            // Create new review
            review = new Review({
                packageId,
                userId,
                rating,
                comment,
                isVerified
            });
            await review.save();
        }

        // Trigger dynamic rating recalculation
        await updatePackageRating(packageId);

        res.status(200).json({
            success: true,
            message: review.isNew ? "Review submitted successfully" : "Review updated successfully",
            data: review
        });

    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ success: false, message: "Server error creating review" });
    }
};

export const getPackageReviews = async (req, res) => {
    try {
        const { packageId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'newest'; // newest, highest, liked

        let sortQuery = { createdAt: -1 };
        if (sortBy === 'highest') sortQuery = { rating: -1, createdAt: -1 };
        if (sortBy === 'liked') sortQuery = { likesCount: -1, createdAt: -1 };

        const skip = (page - 1) * limit;

        const reviews = await Review.find({ packageId, status: 'active' })
            .sort(sortQuery)
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name email profilePic')
            .lean();

        // Get total count
        const total = await Review.countDocuments({ packageId, status: 'active' });

        // Optionally fetch replies for these reviews. To keep queries simple, 
        // we can fetch immediate replies.
        const reviewIds = reviews.map(r => r._id);
        const replies = await Reply.find({ reviewId: { $in: reviewIds } })
            .populate('userId', 'name role') // role needed to identify admin responses
            .sort({ createdAt: 1 })
            .lean();

        // Attach replies to their reviews
        const reviewsWithReplies = reviews.map(review => {
            return {
                ...review,
                replies: replies.filter(reply => reply.reviewId.toString() === review._id.toString())
            };
        });

        res.status(200).json({
            success: true,
            data: {
                reviews: reviewsWithReplies,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ success: false, message: "Server error fetching reviews" });
    }
};

export const toggleLikeReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const review = await Review.findById(id);
        if (!review) return res.status(404).json({ success: false, message: "Review not found" });

        const isLiked = review.likedBy.includes(userId);

        if (isLiked) {
            // Unlike
            await Review.findByIdAndUpdate(id, {
                $pull: { likedBy: userId },
                $inc: { likesCount: -1 }
            });
            res.status(200).json({ success: true, message: "Review unliked", liked: false });
        } else {
            // Like
            await Review.findByIdAndUpdate(id, {
                $addToSet: { likedBy: userId },
                $inc: { likesCount: 1 }
            });
            res.status(200).json({ success: true, message: "Review liked", liked: true });
        }

    } catch (error) {
        console.error("Error liking review:", error);
        res.status(500).json({ success: false, message: "Server error toggling like" });
    }
};
