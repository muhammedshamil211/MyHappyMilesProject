import React from 'react';
import Skeleton from '../../../shared/Skeleton/Skeleton';
import styles from '../PlaceCard/placeCard.module.css';

const PlaceCardSkeleton = () => {
  return (
    <div className={styles.card}>
      <div className={styles.imageDiv}>
        <Skeleton height="100%" variant="card" />
      </div>
      <div className={styles.nameDiv}>
        <Skeleton width="120px" height="18px" />
      </div>
    </div>
  );
};

export default PlaceCardSkeleton;
