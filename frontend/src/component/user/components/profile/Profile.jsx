import React, { useEffect, useState } from 'react'
import style from './Profile.module.css'
import CloseButton from '../ui/closeButton/CloseButton';
import Toast from '../toast/Toast';
import { useNavigate } from 'react-router-dom';

function Profile({ user, setUser, profileOpen, setProfileOpen }) {
    const navigate = useNavigate();

    const [tempName, setTempName] = useState(user?.name || "");
    const [email, setEmail] = useState('');
    const [toast, setToast] = useState(false);
    const [message, setMessage] = useState(null);
    const [type, setType] = useState('success');
    
    // Tab State: 'profile', 'orders', 'wishlist'
    const [activeTab, setActiveTab] = useState('profile');
    const [wishlist, setWishlist] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        if (user) {
            setTempName(user.name)
        }
    }, [user])

    // Fetch orders and wishlist when tabs change or profile opens
    useEffect(() => {
        if (profileOpen) {
            loadWishlist();
            if (user) {
                fetchOrders();
            }
        }
    }, [profileOpen, activeTab, user]);

    const loadWishlist = () => {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(storedWishlist);
    };

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/booking/user`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoadingOrders(false);
        }
    }

    const removeFromWishlist = (id) => {
        const updated = wishlist.filter(item => item._id !== id);
        setWishlist(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
        
        // Dispatch custom event to notify other components (e.g. PackageCards)
        window.dispatchEvent(new Event('wishlistUpdated'));
    };

    const handleLogout = async () => {
        try {
            // IMPORTANT: credentials:include sends the HttpOnly refreshToken cookie
            // to the server so it can be invalidated in the DB and cleared from the browser.
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/logout`, {
                method: "POST",
                credentials: "include"
            });

            const data = await res.json();
            console.log("Logout response:", data); // Debug — confirm server received cookie
        } catch (err) {
            console.error("Logout server call failed:", err);
        } finally {
            // Always clear local state regardless of server response
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            setProfileOpen(false);
            navigate('/'); // Redirect to home so user can't stay on protected pages
        }
    };

    const updateName = async () => {
        if (!tempName.trim()) {
            setMessage("Name cannot be empty");
            setType("error");
            setToast(true);
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/edit`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: tempName })
            });

            const data = await res.json();

            if (data.data?.user) {
                localStorage.setItem("user", JSON.stringify(data.data.user));
                setUser(data.data.user);

                setMessage("Name updated successfully");
                setType("success");
            } else {
                setMessage(data.message || "Update failed");
                setType("error");
            }

        } catch (err) {
            setMessage("Server error");
            setType("error");
        }
        setToast(true);
    };

    const handleDelete = async () => {
        if (!email) {
            setMessage("Email is required to delete account");
            setType("error");
            setToast(true);
            return;
        }

        if (email !== user.email) {
            setMessage("Entered email does not match");
            setType("error");
            setToast(true);
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/edit`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (data.data?.delete) {
                setMessage(data.message || "Account deleted");
                setType("success");
                setToast(true);
                handleLogout();
            } else {
                setMessage(data.message || "Delete failed");
                setType("error");
                setToast(true);
            }

        } catch (err) {
            setMessage("Server error");
            setType("error");
            setToast(true);
        }
    };

    if (!profileOpen) return null;

    return (
        <div className={style.profileContainer} onClick={(e) => {
            if(e.target === e.currentTarget) setProfileOpen(false)
        }}>
            <div className={style.card}>
                <CloseButton onClick={() => setProfileOpen(false)} />
                <p className={style.title}>Hello, {user?.name} 👋</p>
                
                {/* Tabs */}
                <div className={style.tabContainer}>
                    <div 
                        className={`${style.tab} ${activeTab === 'profile' ? style.activeTab : ''}`} 
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </div>
                    <div 
                        className={`${style.tab}`} 
                        onClick={() => {
                            setProfileOpen(false);
                            navigate('/my-orders');
                        }}
                    >
                        My Orders
                    </div>
                    <div 
                        className={`${style.tab} ${activeTab === 'wishlist' ? style.activeTab : ''}`} 
                        onClick={() => setActiveTab('wishlist')}
                    >
                        Wishlist
                    </div>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="an-slide">
                        <p className={style.sectionLabel}>Edit username</p>
                        <div className={style.gridRow}>
                            <input
                                type="text"
                                value={tempName}
                                className={style.inputField}
                                onChange={(e) => setTempName(e.target.value)}
                            />
                            <button className={`${style.button} ${style.blueBtn}`} onClick={() => {
                                updateName();
                                setToast(true);
                            }}>
                                Update
                            </button>
                        </div>

                        <hr className={style.separator} />

                        <p className={style.sectionLabel}>
                            Danger Zone
                            <span className={style.deleteWarning}>Account deletion is permanent</span>
                        </p>
                        <div className={style.gridRow}>
                            <input
                                type="text"
                                className={style.inputField}
                                placeholder='Enter email to confirm'
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className={`${style.button} ${style.darkRedBtn}`} onClick={() => {
                                handleDelete();
                                setToast(true);
                            }}>
                                Delete
                            </button>
                        </div>

                        <hr className={style.separator} />

                        <button
                            className={`${style.button} ${style.redBtn}`}
                            onClick={() => {
                                handleLogout();
                                setMessage("logout successfully");
                                setType("info");
                                setToast(true);
                            }}
                        >
                            Logout
                        </button>
                    </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === 'wishlist' && (
                    <div className={`an-slide ${style.listContainer}`}>
                        {wishlist.length > 0 ? (
                            wishlist.map((item, i) => (
                                <div key={i} className={style.listItem} onClick={() => {
                                    navigate(`/package/${item._id}`);
                                    setProfileOpen(false);
                                }} style={{cursor: 'pointer'}}>
                                    <img src={item.thumbnail} alt={item.title} className={style.itemImage} />
                                    <div className={style.itemDetails}>
                                        <p className={style.itemTitle}>{item.title}</p>
                                        <p className={style.itemSub}>{item.duration}</p>
                                        <p className={style.itemPrice}>₹{(item.price || 0).toLocaleString()}</p>
                                    </div>
                                    <button 
                                        className={style.actionBtn} 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFromWishlist(item._id);
                                        }}
                                        title="Remove from wishlist"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className={style.emptyState}>Your wishlist is empty. Explore our packages and heart your favourites!</p>
                        )}
                    </div>
                )}
            </div>

            {toast && (
                <Toast
                    message={message}
                    type={type}
                    onClose={() => setToast(false)}
                />
            )}
        </div>
    )
}

export default Profile