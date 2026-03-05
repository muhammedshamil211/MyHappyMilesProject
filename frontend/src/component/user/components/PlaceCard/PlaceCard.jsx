import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './placecard.module.css';

function PlaceCard({ image, name }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/place/${name}`);
    };

    return (
        <div className={styles.card}>
            <img 
                src={image} 
                alt={name}
                className={styles.image} 
                onClick={handleClick} 
            />
            <p className={styles.name}>{name}</p>
        </div>
    );
}

export default PlaceCard;