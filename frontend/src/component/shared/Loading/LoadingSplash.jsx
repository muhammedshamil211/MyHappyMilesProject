import React from 'react';
import styles from './LoadingSplash.module.css';

const LoadingSplash = () => {
  return (
    <div className={styles.splashContainer}>
        <div className={styles.logoWrapper}>
            <div className={styles.logoInner}>
                {/* Logo or Platform Icon */}
                <span className={styles.icon}>✈️</span>
                <h1 className={styles.brand}>MyHappyMiles</h1>
            </div>
            <div className={styles.progressLine}></div>
        </div>
    </div>
  );
};

export default LoadingSplash;
