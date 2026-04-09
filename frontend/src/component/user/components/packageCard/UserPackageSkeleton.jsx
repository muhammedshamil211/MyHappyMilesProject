import React from 'react';
import Skeleton from '../../../shared/Skeleton/Skeleton';
import styles from '../PackageCard/package.module.css';

const UserPackageSkeleton = () => {
  return (
    <div className={styles.card}>
      <div className={styles.imageDiv}>
        <Skeleton height="100%" variant="card" />
      </div>
      <div className={styles.detailsDiv}>
        <Skeleton width="40%" height="15px" />
        <Skeleton width="80%" height="24px" style={{ marginTop: '10px' }} />
        <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
            <Skeleton width="60px" height="15px" />
            <Skeleton width="60px" height="15px" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <Skeleton width="80px" height="24px" />
            <Skeleton width="100px" height="35px" />
        </div>
      </div>
    </div>
  );
};

export default UserPackageSkeleton;
