import React, { useEffect, useState } from 'react';
import styles from './AdminBookings.module.css';
import SortFilterBar from '../../shared/SortFilterBar/SortFilterBar';
import TableSkeleton from '../AdminAnalytics/TableSkeleton';

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterValues, setFilterValues] = useState({ sortBy: 'newest', status: 'all' });

    useEffect(() => {
        fetchBookings(page);
    }, [page, filterValues]);

    const fetchBookings = async (currentPage) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { sortBy, status } = filterValues;
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                ...(sortBy && { sortBy }),
                ...(status && { status })
            });

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/bookings?${params.toString()}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setBookings(data.data.bookings);
                setTotalPages(data.data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch admin bookings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ bookingStatus: newStatus })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`Booking marked as ${newStatus}`);
                fetchBookings(page); // Refresh current page
            } else {
                toast.error(data.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    return (
        <div className={styles.main}>
            <div className={styles.headSection}>
                <h2 className={styles.head}>All Bookings</h2>
                <SortFilterBar
                    values={filterValues}
                    onChange={(key, val) => {
                        setFilterValues(prev => ({ ...prev, [key]: val }));
                        setPage(1);
                    }}
                    onReset={() => { setFilterValues({ sortBy: 'newest', status: 'all' }); setPage(1); }}
                    sorts={[
                        { label: 'Newest', value: 'newest' },
                        { label: 'Oldest', value: 'oldest' },
                        { label: 'Most Pax', value: 'most_pax' }
                    ]}
                    filters={[
                        {
                            label: 'Status',
                            key: 'status',
                            options: [
                                { label: 'All', value: 'all' },
                                { label: 'Pending', value: 'pending' },
                                { label: 'Confirmed', value: 'confirmed' },
                                { label: 'Cancelled', value: 'cancelled' }
                            ]
                        }
                    ]}
                />
            </div>
            
            <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>User Info</th>
                                <th>Package</th>
                                <th>Date</th>
                                <th>Pax</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableSkeleton rows={8} cols={6} />
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map(booking => (
                                    <tr key={booking._id} className={styles.bookingRow}>
                                        <td>
                                            <strong>{booking.userId?.name || booking.name}</strong><br/>
                                            <small>{booking.userId?.email || booking.email}</small><br/>
                                            <small>{booking.phone}</small>
                                        </td>
                                        <td>{booking.packageId?.title || "Unknown Package"}</td>
                                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                                        <td>{booking.people || booking.count}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles['status-' + (booking.status || 'pending')]}`}>
                                                {booking.status || 'pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <select 
                                                className={styles.actionSelect}
                                                value={booking.status || 'pending'}
                                                onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                                                disabled={booking.status === 'cancelled'}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirm</option>
                                                <option value="cancelled">Cancel</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                        
                        <div className={styles.pagination}>
                            <button 
                                className={styles.btn} 
                                disabled={page === 1} 
                                onClick={() => setPage(p => p - 1)}
                            >
                                Prev
                            </button>
                            <span style={{alignSelf: 'center'}}>Page {page} of {totalPages || 1}</span>
                            <button 
                                className={styles.btn} 
                                disabled={page >= totalPages} 
                                onClick={() => setPage(p => p + 1)}
                            >
                                Next
                            </button>
                        </div>
            </div>
        </div>
    );
}
