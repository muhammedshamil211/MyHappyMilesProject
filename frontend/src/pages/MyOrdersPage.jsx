import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Nav from '../component/user/layout/Nav/Nav';
import Footer from '../component/user/layout/footer/Footer';
import styles from './MyOrdersPage.module.css';

export default function MyOrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/v1/my-booking", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setOrders(data.data.booking);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/v1/my-booking/${bookingId}/cancel`, {
                method: 'PATCH',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            
            if (data.success) {
                toast.success("Booking cancelled successfully!");
                fetchOrders(); // Refresh
            } else {
                toast.error(data.message || "Failed to cancel booking.");
            }
        } catch (err) {
            toast.error("Error cancelling booking.");
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <header 
                className={styles.banner}
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1600)` }}
            >
                <div className={styles.bannerOverlay}>
                    <Nav />
                    <div className={styles.bannerContent}>
                        <h1 className={styles.bannerTitle}>My Happy Miles</h1>
                    </div>
                </div>
            </header>
            
            <div className={styles.container}>
                <h1 className={styles.title}>My Orders</h1>
                
                {loading ? (
                    <p>Loading your orders...</p>
                ) : orders.length === 0 ? (
                    <div className={styles.noOrders}>You have no orders yet.</div>
                ) : (
                    <div className={styles.grid}>
                        {orders.map(order => (
                            <div key={order._id} className={styles.orderCard}>
                                <div className={styles.details}>
                                    <h3 
                                        className={styles.packageTitle}
                                        onClick={() => {
                                            if (order.packageId?._id) {
                                                navigate(`/package/${order.packageId._id}`);
                                            }
                                        }}
                                        title={order.packageId ? "View Package details" : ""}
                                    >
                                        {order.packageId?.title || "Package Title"}
                                    </h3>
                                    <p className={styles.subText}>Travel Date: {new Date(order.date).toLocaleDateString()}</p>
                                    <p className={styles.subText}>Travelers: {order.people || order.count}</p>
                                    <p className={styles.subText}>Total Price: ₹{(order.totalAmount || 0).toLocaleString()}</p>
                                </div>
                                <div className={styles.statusSection}>
                                    <span className={`${styles.badge} ${styles[order.status || 'pending']}`}>
                                        {order.status || 'pending'}
                                    </span>
                                    {order.status !== 'cancelled' && (
                                        <button 
                                            className={styles.cancelBtn}
                                            onClick={() => handleCancel(order._id)}
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
