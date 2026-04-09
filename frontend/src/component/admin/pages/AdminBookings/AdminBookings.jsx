import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './AdminBookings.module.css';

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchBookings(page);
    }, [page]);

    const fetchBookings = async (currentPage) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/v1/admin/bookings?page=${currentPage}&limit=10`, {
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
            const res = await fetch(`http://localhost:5000/api/v1/admin/bookings/${bookingId}/status`, {
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
            </div>
            
            <div className={styles.tableWrapper}>
                {loading ? (
                    <p>Loading...</p>
                ) : bookings.length === 0 ? (
                    <p className={styles.emptyState}>No bookings found.</p>
                ) : (
                    <>
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
                                {bookings.map(booking => (
                                    <tr key={booking._id}>
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
                                ))}
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
                    </>
                )}
            </div>
        </div>
    );
}
