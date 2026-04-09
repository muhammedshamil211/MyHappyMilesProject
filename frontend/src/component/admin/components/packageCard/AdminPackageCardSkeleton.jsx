import React from 'react';
import Skeleton from '../../../shared/Skeleton/Skeleton';
import style from './AdminPackageCard.module.css';

const AdminPackageCardSkeleton = () => {
  return (
    <div className={style.card}>
      <div className={style.imageDiv}>
        <Skeleton height="180px" variant="card" />
      </div>
      <h1 className={style.detHead} style={{ marginTop: '15px' }}><Skeleton width="100px" height="20px" /></h1>
      <hr />
      <div className={style.detailContainer}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={style.detailsDiv} style={{ marginBottom: '10px' }}>
            <Skeleton width="60px" height="15px" />
            <Skeleton width="120px" height="15px" style={{ marginLeft: '10px' }} />
          </div>
        ))}
        <div className={style.buttonDiv} style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
          <Skeleton width="70px" height="32px" />
          <Skeleton width="100px" height="32px" />
          <Skeleton width="70px" height="32px" />
        </div>
      </div>
    </div>
  );
};

export default AdminPackageCardSkeleton;
