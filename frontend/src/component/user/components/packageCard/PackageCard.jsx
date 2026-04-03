import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../../../context/LoginContext'
import style from './PackageCard.module.css'

function PackageCard({ packagePlace, placeName }) {

    const navigate = useNavigate();
    const { setLogin } = useContext(LoginContext);

    if (!packagePlace) return null;

    // Resolve thumbnail: prefer images[], fall back to legacy image string
    const thumbnail = packagePlace?.images?.[0] || packagePlace?.image || '';

    const handleViewDetails = async () => {
        if (!localStorage.getItem('user')) {
            setLogin(true);
            return;
        }

        // Increment view count silently
        try {
            await fetch(`http://localhost:5000/api/v1/packages/view/${packagePlace._id}`, {
                method: 'PUT',
            });
        } catch (err) {
            console.error('Failed to increment view count', err);
        }

        navigate(`/package/${packagePlace._id}`);
    };

    return (
        <div className={style.packageCard}>
            <div className={style.imageDiv}>
                <img src={thumbnail} className={style.image} alt={packagePlace.title} />
            </div>
            <div className={style.contentContainer}>
                <div className={style.contents}>
                    <p className={style.title}>{packagePlace.title}</p>
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