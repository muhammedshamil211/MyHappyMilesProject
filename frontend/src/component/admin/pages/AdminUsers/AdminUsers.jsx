import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './AdminUsers.module.css';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchTopUsers();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(page, search);
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [page, search]);

    const fetchTopUsers = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/v1/admin/users/top?limit=3`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setTopUsers(data.data.topUsers);
            }
        } catch (error) {
            console.error("Failed to fetch top users", error);
        }
    };

    const fetchUsers = async (currentPage, searchQuery) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/v1/admin/users?page=${currentPage}&limit=10&search=${searchQuery}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setUsers(data.data.users);
                setTotalPages(data.data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        if (!window.confirm(`Change user status to ${newStatus}?`)) return;
        try {
            const res = await fetch(`http://localhost:5000/api/v1/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`User status changed to ${newStatus}`);
                fetchUsers(page, search);
            } else {
                toast.error(data.message || "Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Change user role to ${newRole}?`)) return;
        try {
            const res = await fetch(`http://localhost:5000/api/v1/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ role: newRole })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`User promoted/demoted to ${newRole}`);
                fetchUsers(page, search);
            } else {
                toast.error(data.message || "Failed to update role");
            }
        } catch (error) {
            toast.error("Error updating role");
        }
    };

    return (
        <div className={styles.main}>
            {/* Top Users Ranking */}
            {topUsers.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                    <h2 className={styles.head} style={{ marginBottom: '15px' }}>Top Premium Users</h2>
                    <div className={styles.rankingGrid}>
                        {topUsers.map(user => (
                            <div key={user._id} className={`${styles.rankCard} ${styles[`rank-${user.rank}`]}`}>
                                <div className={styles.rankBadge}>#{user.rank}</div>
                                <h3>{user.name}</h3>
                                <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>{user.email}</p>
                                <div style={{ marginTop: '10px' }}>
                                    <strong>Spent: </strong> ₹{(user.totalSpent || 0).toLocaleString()} <br/>
                                    <strong>Bookings: </strong> {user.totalBookings || 0}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Users Table */}
            <div className={styles.headSection}>
                <h2 className={styles.head}>All Users & Analytics</h2>
            </div>
            
            <div className={styles.tableWrapper}>
                <div className={styles.filters}>
                    <input 
                        type="text" 
                        placeholder="Search users by name or email..." 
                        className={styles.searchInput}
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : users.length === 0 ? (
                    <p className={styles.emptyState}>No users found.</p>
                ) : (
                    <>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>User Info</th>
                                    <th>Status</th>
                                    <th>Role</th>
                                    <th>Analytics (Spent/Bkgs)</th>
                                    <th>Last Booking</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <strong>{user.name}</strong><br/>
                                            <small>{user.email}</small>
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${styles['badge-' + user.status]}`}>
                                                {user.status || 'active'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${styles['badge-' + user.role]}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ color: '#ff5100', fontWeight: 'bold' }}>₹{user.totalSpent?.toLocaleString() || 0}</span><br/>
                                            <small>{user.totalBookings || 0} Bookings</small>
                                        </td>
                                        <td>
                                            {user.lastBookingDate ? new Date(user.lastBookingDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td>
                                            {user.status === 'blocked' ? (
                                                <button className={styles.actionBtn} onClick={() => handleStatusChange(user._id, 'active')}>Unblock</button>
                                            ) : (
                                                <button className={styles.actionBtn} onClick={() => handleStatusChange(user._id, 'blocked')}>Block</button>
                                            )}
                                            
                                            {user.role === 'admin' ? (
                                                <button className={styles.actionBtn} onClick={() => handleRoleChange(user._id, 'user')}>Demote (User)</button>
                                            ) : (
                                                <button className={styles.actionBtn} onClick={() => handleRoleChange(user._id, 'admin')}>Promote (Admin)</button>
                                            )}
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
