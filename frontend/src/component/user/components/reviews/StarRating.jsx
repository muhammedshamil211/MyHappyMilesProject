import React from 'react';
import style from './StarRating.module.css';

export default function StarRating({ rating, setRating, readOnly = false, size = 18 }) {
    
    // Create an array of 5 items
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);

    return (
        <div className={style.starContainer}>
            {stars.map((star) => {
                const isFilled = star <= rating;
                
                return (
                    <span
                        key={star}
                        className={`${style.star} ${isFilled ? style.filled : style.empty} ${readOnly ? style.readOnly : style.interactive}`}
                        onClick={() => !readOnly && setRating(star)}
                        style={{ fontSize: `${size}px` }}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
}
