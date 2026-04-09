import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import style from './ReviewSection.module.css';
import StarRating from './StarRating';
import { LoginContext } from '../../../../context/LoginContext';

export default function ReviewSection({ packageId }) {
    
    const { setLogin } = useContext(LoginContext);
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [sortBy, setSortBy] = useState('newest'); // newest, highest, liked

    // Review Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    // Reply Form State
    const [replyingTo, setReplyingTo] = useState(null); // review_id
    const [replyComment, setReplyComment] = useState('');
    const [replyLoading, setReplyLoading] = useState(false);

    useEffect(() => {
        fetchReviews(1, sortBy);
    }, [packageId, sortBy]);

    const fetchReviews = async (page = 1, sort = 'newest') => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/v1/reviews/${packageId}?page=${page}&limit=5&sortBy=${sort}`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.data.reviews);
                setPagination({
                    page: data.data.pagination.page,
                    totalPages: data.data.pagination.pages
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setLogin(true);
            return;
        }

        if (!comment.trim()) {
            toast.error("Please provide a comment.");
            return;
        }

        setSubmitLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/v1/reviews/${packageId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ rating, comment })
            });
            const data = await res.json();
            
            if (data.success) {
                toast.success(data.message);
                setComment('');
                setRating(5);
                fetchReviews(1, sortBy);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Error submitting review");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleLike = async (reviewId) => {
        if (!token) {
            setLogin(true);
            return;
        }
        
        try {
            const res = await fetch(`http://localhost:5000/api/v1/reviews/${reviewId}/like`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                // Optimistically update
                setReviews(prev => prev.map(r => {
                    if (r._id === reviewId) {
                        return { 
                            ...r, 
                            likesCount: data.liked ? r.likesCount + 1 : r.likesCount - 1,
                            likedBy: data.liked 
                                ? [...r.likedBy, storedUser?.id] 
                                : r.likedBy.filter(id => id !== storedUser?.id)
                        };
                    }
                    return r;
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleReplySubmit = async (e, reviewId) => {
        e.preventDefault();
        if (!token) { setLogin(true); return; }
        if (!replyComment.trim()) { return toast.error("Reply cannot be empty"); }

        setReplyLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/v1/reviews/${reviewId}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ comment: replyComment })
            });
            const data = await res.json();
            
            if (data.success) {
                toast.success("Reply posted!");
                setReplyingTo(null);
                setReplyComment('');
                // update locally without refetching whole page
                setReviews(prev => prev.map(r => {
                    if(r._id === reviewId) {
                        return { ...r, replies: [...(r.replies || []), data.data] };
                    }
                    return r;
                }));
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Error posting reply");
        } finally {
            setReplyLoading(false);
        }
    };

    return (
        <div className={style.section}>
            <h2 className={style.heading}>Customer Reviews</h2>

            {/* Review Form */}
            <div className={style.reviewFormCard}>
                <h3>Write a Review</h3>
                <form onSubmit={handleReviewSubmit}>
                    <div className={style.ratingInput}>
                        <span>Your Rating:</span>
                        <StarRating rating={rating} setRating={setRating} size={24} />
                    </div>
                    <textarea 
                        className={style.textarea}
                        rows="3" 
                        placeholder="Share your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button type="submit" className={style.submitBtn} disabled={submitLoading}>
                        {submitLoading ? 'Submitting...' : 'Post Review'}
                    </button>
                </form>
            </div>

            {/* Controls */}
            <div className={style.controls}>
                <span className={style.reviewCount}>{pagination.totalPages > 0 ? "Showing reviews" : "No reviews yet"}</span>
                <select className={style.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">Recent</option>
                    <option value="highest">Highest Rated</option>
                    <option value="liked">Most Helpful</option>
                </select>
            </div>

            {/* List */}
            {loading ? (
                <div className={style.loading}>Loading reviews...</div>
            ) : (
                <div className={style.list}>
                    {reviews.map(review => {
                        const hasLiked = storedUser && review.likedBy?.includes(storedUser.id);
                        
                        return (
                            <div key={review._id} className={style.reviewCard}>
                                <div className={style.reviewHeader}>
                                    <div className={style.userInfo}>
                                        <div className={style.avatar}>
                                            {review.userId?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <h4 className={style.userName}>
                                                {review.userId?.name}
                                                {review.isVerified && <span className={style.verifiedBadge}>✓ Verified Booking</span>}
                                            </h4>
                                            <span className={style.date}>{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} readOnly size={16} />
                                </div>
                                
                                <p className={style.comment}>{review.comment}</p>
                                
                                <div className={style.actionsRow}>
                                    <button 
                                        className={`${style.actionBtn} ${hasLiked ? style.activeLike : ''}`}
                                        onClick={() => handleLike(review._id)}
                                    >
                                        👍 Helpful ({review.likesCount})
                                    </button>
                                    <button 
                                        className={style.actionBtn}
                                        onClick={() => {
                                            setReplyingTo(replyingTo === review._id ? null : review._id);
                                        }}
                                    >
                                        💬 Reply
                                    </button>
                                </div>

                                {/* Replies Map */}
                                {review.replies && review.replies.length > 0 && (
                                    <div className={style.repliesList}>
                                        {review.replies.map(reply => (
                                            <div key={reply._id} className={`${style.replyCard} ${reply.userId?.role === 'admin' ? style.adminReply : ''}`}>
                                                <div className={style.replyHeader}>
                                                    <strong>{reply.userId?.name} {reply.userId?.role === 'admin' && <span className={style.adminBadge}>Admin</span>}</strong>
                                                    <span className={style.date}>{new Date(reply.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className={style.replyComment}>{reply.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Reply Input Area */}
                                {replyingTo === review._id && (
                                    <form className={style.replyForm} onSubmit={(e) => handleReplySubmit(e, review._id)}>
                                        <input 
                                            type="text" 
                                            className={style.replyInput}
                                            placeholder="Write a reply..."
                                            value={replyComment}
                                            onChange={(e) => setReplyComment(e.target.value)}
                                            autoFocus
                                        />
                                        <button className={style.replySubmitBtn} disabled={replyLoading}>
                                            Post
                                        </button>
                                    </form>
                                )}

                            </div>
                        )
                    })}
                </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className={style.pagination}>
                    <button 
                        disabled={pagination.page === 1} 
                        onClick={() => fetchReviews(pagination.page - 1, sortBy)}
                        className={style.pageBtn}
                    >Prev</button>
                    <span>Page {pagination.page} of {pagination.totalPages}</span>
                    <button 
                        disabled={pagination.page === pagination.totalPages} 
                        onClick={() => fetchReviews(pagination.page + 1, sortBy)}
                        className={style.pageBtn}
                    >Next</button>
                </div>
            )}

        </div>
    );
}
