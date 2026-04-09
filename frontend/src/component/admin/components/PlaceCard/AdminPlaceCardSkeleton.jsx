import React from 'react';
import Skeleton from '../../../shared/Skeleton/Skeleton';
import style from './AdminPlaceCard.module.css';

const AdminPlaceCardSkeleton = () => {
  return (
    <div className={style.card}>
      <div className={style.imageHeader}>
        <Skeleton height="160px" variant="card" />
      </div>
      <div className={style.cardContent}>
        <Skeleton width="70%" height="24px" className={style.cardTitle} />
        <div className={style.statsRow} style={{ marginTop: '1rem' }}>
          <Skeleton width="120px" height="18px" />
        </div>
        <div className={style.actionRow} style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
          <Skeleton width="60px" height="30px" />
          <Skeleton width="60px" height="30px" />
        </div>
      </div>
    </div>
  );
};

export default AdminPlaceCardSkeleton;
