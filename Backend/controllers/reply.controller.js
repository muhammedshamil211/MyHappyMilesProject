import Reply from "../models/Reply.js";
import Review from "../models/Review.js";

export const addReply = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { comment } = req.body;
        const userId = req.user.id; // From auth middleware

        if (!comment || comment.trim() === '') {
            return res.status(400).json({ success: false, message: "Reply comment is required" });
        }

        // Ensure review exists and is active
        const review = await Review.findById(reviewId);
        if (!review || review.status !== 'active') {
            return res.status(404).json({ success: false, message: "Target review not found or is inactive" });
        }

        const reply = new Reply({
            reviewId,
            userId,
            comment
        });

        await reply.save();

        const populatedReply = await Reply.findById(reply._id).populate('userId', 'name role');

        res.status(201).json({
            success: true,
            message: "Reply posted successfully",
            data: populatedReply
        });

    } catch (error) {
        console.error("Error posting reply:", error);
        res.status(500).json({ success: false, message: "Server error creating reply" });
    }
};
