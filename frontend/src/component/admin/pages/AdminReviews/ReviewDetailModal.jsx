import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import style from './ReviewDetailModal.module.css';
import StarRating from '../../../user/components/reviews/StarRating';

export default function ReviewDetailModal({ review, onClose, onStatusChange }) {
    const [replies, setReplies] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(review.likesCount || 0);
    const [loadingReplies, setLoadingReplies] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchReplies();
    }, []);

    const fetchReplies = async () => {
        try {
            setLoadingReplies(true);
            // Use admin reviews endpoint to get the review with replies populated
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/reviews/${review._id}/replies`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (data.success) {
                setReplies(data.data.replies || []);
                setLiked(data.data.isLiked || false);
                setLikeCount(data.data.likesCount ?? review.likesCount ?? 0);
            }
        } catch (err) {
            console.error('Failed to fetch replies', err);
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleLike = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/reviews/${review._id}/like`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setLiked(data.liked);
                setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
                toast.success(data.liked ? 'Liked!' : 'Unliked');
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to toggle like');
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) {
            toast.error('Reply cannot be empty');
            return;
        }
        try {
            setSubmitting(true);
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/reviews/${review._id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ comment: replyText })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Reply posted!');
                setReplyText('');
                fetchReplies(); // Reload replies
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to post reply');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={style.overlay} onClick={onClose}>
            <div className={style.modal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={style.header}>
                    <h2 className={style.headerTitle}>Review Details</h2>
                    <button className={style.closeBtn} onClick={onClose}>✕</button>
                </div>

                {/* Review Card */}
                <div className={style.reviewCard}>
                    <div className={style.reviewMeta}>
                        <div className={style.avatar}>
                            {(review.userId?.name || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                            <div className={style.userName}>{review.userId?.name || 'Unknown'}</div>
                            <div className={style.userEmail}>{review.userId?.email}</div>
                        </div>
                        <div className={style.metaRight}>
                            <StarRating rating={review.rating} readOnly size={16} />
                            <div className={style.date}>
                                {new Date(review.createdAt).toLocaleDateString('en-IN', { 
                                    day: 'numeric', month: 'short', year: 'numeric' 
                                })}
                            </div>
                        </div>
                    </div>

                    <div className={style.packageTag}>📦 {review.packageId?.title || 'Unknown Package'}</div>

                    {review.isVerified && (
                        <div className={style.verifiedBadge}>✔ Verified Booking</div>
                    )}

                    <p className={style.fullComment}>{review.comment}</p>

                    {/* Like Button */}
                    <button
                        className={`${style.likeBtn} ${liked ? style.likeBtnActive : ''}`}
                        onClick={handleLike}
                    >
                        {liked ? '❤️' : '🤍'} {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                    </button>
                </div>

                {/* Replies Section */}
                <div className={style.repliesSection}>
                    <h3 className={style.repliesTitle}>
                        Replies {!loadingReplies && `(${replies.length})`}
                    </h3>

                    {loadingReplies ? (
                        <p className={style.loadingText}>Loading replies...</p>
                    ) : replies.length === 0 ? (
                        <p className={style.emptyText}>No replies yet. Be the first to respond!</p>
                    ) : (
                        <div className={style.repliesList}>
                            {replies.map(r => (
                                <div
                                    key={r._id}
                                    className={`${style.replyItem} ${r.userId?.role === 'admin' ? style.replyAdmin : ''}`}
                                >
                                    <div className={style.replyHeader}>
                                        <span className={style.replyAuthor}>{r.userId?.name || 'Unknown'}</span>
                                        {r.userId?.role === 'admin' && (
                                            <span className={style.adminTag}>Admin</span>
                                        )}
                                        <span className={style.replyDate}>
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={style.replyText}>{r.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reply Form */}
                <div className={style.replyForm}>
                    <h3 className={style.replyFormTitle}>Post Admin Reply</h3>
                    <textarea
                        className={style.textarea}
                        rows={3}
                        placeholder="Write a reply as admin..."
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                    />
                    <button
                        className={style.submitBtn}
                        onClick={handleReply}
                        disabled={submitting}
                    >
                        {submitting ? 'Posting...' : '↩ Post Reply'}
                    </button>
                </div>
            </div>
        </div>
    );
}
