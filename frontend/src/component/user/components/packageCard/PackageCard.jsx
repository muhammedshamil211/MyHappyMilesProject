import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../../../context/LoginContext'
import style from './PackageCard.module.css'
import StarRating from '../reviews/StarRating';

function PackageCard({ packagePlace, placeName }) {

    const navigate = useNavigate();
    const { setLogin } = useContext(LoginContext);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        if (!packagePlace) return;
        
        // Initial check
        const checkWishlist = () => {
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            setIsWishlisted(wishlist.some(item => item._id === packagePlace._id));
        };
        
        checkWishlist();

        // Listen for updates from other components
        window.addEventListener('wishlistUpdated', checkWishlist);
        return () => window.removeEventListener('wishlistUpdated', checkWishlist);
    }, [packagePlace]);

    if (!packagePlace) return null;

    // Resolve thumbnail: prefer images[], fall back to legacy image string
    const thumbnail = packagePlace?.images?.[0] || packagePlace?.image || '';

    const handleViewDetails = async (e) => {
        e.stopPropagation();
        if (!localStorage.getItem('user')) {
            setLogin(true);
            return;
        }

        // Increment view count silently
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/packages/view/${packagePlace._id}`, {
                method: 'PUT',
            });
        } catch (err) {
            console.error('Failed to increment view count', err);
        }

        navigate(`/package/${packagePlace._id}`);
    };

    const toggleWishlist = (e) => {
        e.stopPropagation();
        if (!localStorage.getItem('user')) {
            setLogin(true);
            return;
        }

        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        let updatedWishlist;

        if (isWishlisted) {
            updatedWishlist = wishlist.filter(item => item._id !== packagePlace._id);
        } else {
            // Store lightweight version of package for wishlist
            updatedWishlist = [...wishlist, {
                _id: packagePlace._id,
                title: packagePlace.title,
                duration: packagePlace.duration,
                price: packagePlace.price,
                thumbnail: thumbnail
            }];
        }

        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setIsWishlisted(!isWishlisted);

        // Notify other components
        window.dispatchEvent(new Event('wishlistUpdated'));
    };

    return (
        <div className={style.packageCard} onClick={() => navigate(`/package/${packagePlace._id}`)} style={{cursor: 'pointer'}}>
            <div className={style.imageDiv}>
                <img src={thumbnail} className={style.image} alt={packagePlace.title} />
                <button 
                    className={`${style.favBtn} ${isWishlisted ? style.active : ''}`}
                    onClick={toggleWishlist}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div className={style.contentContainer}>
                <div className={style.contents}>
                    <p className={style.title}>{packagePlace.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0' }}>
                        <StarRating rating={packagePlace.averageRating || 0} readOnly size={14} />
                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                            ({packagePlace.totalReviews || 0} reviews)
                        </span>
                    </div>
                    <p className={style.day}>{packagePlace.duration}</p>
                    <p className={style.rateText}>
                        Starts from <span className={style.rate}>
                            ₹{(packagePlace.price || 0).toLocaleString()}
                        </span>
                    </p>
                    <div className={style.buttonDiv}>
                        <button className={style.bookBtn} onClick={handleViewDetails}>
                            View Details →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(PackageCard);