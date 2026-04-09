import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import style from './AdminReviews.module.css';
import StarRating from '../../../user/components/reviews/StarRating';
import ReviewDetailModal from './ReviewDetailModal';
import SortFilterBar from '../../shared/SortFilterBar/SortFilterBar';

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [filterValues, setFilterValues] = useState({ sortBy: 'newest', rating: '' });

    useEffect(() => {
        fetchReviews(page, statusFilter);
    }, [page, statusFilter, filterValues]);

    const fetchReviews = async (p, status) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const { sortBy, rating } = filterValues;
            const params = new URLSearchParams({
                page: p, limit: 8, status,
                ...(sortBy && { sortBy }),
                ...(rating && { rating })
            });
            const res = await fetch(`http://localhost:5000/api/v1/admin/reviews?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setReviews(data.data.reviews);
                setTotalPages(data.data.pagination.totalPages);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/v1/admin/reviews/${id}/status`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Review moved to ${newStatus}`);
                fetchReviews(page, statusFilter); // Refresh list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const deleteReview = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this review and its replies?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/v1/admin/reviews/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Review deleted fully!");
                fetchReviews(page, statusFilter);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Error deleting review");
        }
    };

    return (
        <div className={style.main}>
            <div className={style.topSection}>
                <h1>Review Moderation</h1>
                <div className={style.topControls}>
                    <div className={style.filters}>
                        {['all', 'active', 'reported', 'hidden'].map((st) => (
                            <button
                                key={st}
                                className={`${style.filterBtn} ${statusFilter === st ? style.activeFilter : ''}`}
                                onClick={() => { setStatusFilter(st); setPage(1); }}
                            >
                                {st.charAt(0).toUpperCase() + st.slice(1)}
                            </button>
                        ))}
                    </div>
                    <SortFilterBar
                        values={filterValues}
                        onChange={(key, val) => {
                            setFilterValues(prev => ({ ...prev, [key]: val }));
                            setPage(1);
                        }}
                        onReset={() => { setFilterValues({ sortBy: 'newest', rating: '' }); setPage(1); }}
                        sorts={[
                            { label: 'Newest', value: 'newest' },
                            { label: 'Oldest', value: 'oldest' },
                            { label: 'Most Liked', value: 'liked' },
                            { label: 'Highest Rated', value: 'highest' },
                            { label: 'Lowest Rated', value: 'lowest' }
                        ]}
                        filters={[
                            {
                                label: 'Min Rating',
                                key: 'rating',
                                options: [
                                    { label: 'All', value: '' },
                                    { label: '⭐ 1+', value: '1' },
                                    { label: '⭐ 2+', value: '2' },
                                    { label: '⭐ 3+', value: '3' },
                                    { label: '⭐ 4+', value: '4' },
                                    { label: '⭐ 5', value: '5' }
                                ]
                            }
                        ]}
                    />
                </div>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading reviews...</p>
            ) : (
                <div className={style.tableWrap}>
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Package</th>
                                <th>Rating & Date</th>
                                <th>Comment</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: "center" }}>No reviews found</td></tr>
                            ) : (
                                reviews.map(r => (
                                    <tr key={r._id}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{r.userId?.name || 'Unknown'}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{r.userId?.email}</div>
                                        </td>
                                        <td>{r.packageId?.title || 'Unknown Package'}</td>
                                        <td>
                                            <div style={{ display: 'flex' }}><StarRating rating={r.rating} readOnly size={14} /></div>
                                            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                                                {new Date(r.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <p className={style.truncateComment} title={r.comment}>{r.comment}</p>
                                        </td>
                                        <td>
                                            <span className={`${style.statusBadge} ${style[r.status]}`}>{r.status}</span>
                                        </td>
                                        <td>
                                            <div className={style.actionButtons}>
                                                <button className={style.btnView} onClick={() => setSelectedReview(r)}>View</button>
                                                {r.status !== 'active' && (
                                                    <button className={style.btnApprove} onClick={() => updateStatus(r._id, 'active')}>Approve</button>
                                                )}
                                                {r.status !== 'reported' && (
                                                    <button className={style.btnReport} onClick={() => updateStatus(r._id, 'reported')}>Flag</button>
                                                )}
                                                {r.status !== 'hidden' && (
                                                    <button className={style.btnHide} onClick={() => updateStatus(r._id, 'hidden')}>Hide</button>
                                                )}
                                                <button className={style.btnDelete} onClick={() => deleteReview(r._id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={style.pagination}>
                    <button disabled={page === 1} onClick={() => setPage(page - 1)} className={style.pageBtn}>Prev</button>
                    <span>Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className={style.pageBtn}>Next</button>
                </div>
            )}

            {/* Review Detail Modal */}
            {selectedReview && (
                <ReviewDetailModal
                    review={selectedReview}
                    onClose={() => setSelectedReview(null)}
                    onStatusChange={() => fetchReviews(page, statusFilter)}
                />
            )}
        </div>
    );
}
