import React from 'react'
import styles from './PackageSkelton.module.css'

export default function PackageSkelton() {
    return (

        <div className={styles.skeletonCard}>
            <div className={`${styles.skelImage} ${styles.skeletonShimmer}`}></div>

            <div className={styles.skelContent}>
                <div className={`${styles.skelTitle} ${styles.skeletonShimmer}`}></div>
                <div className={`${styles.skelDay} ${styles.skeletonShimmer}`}></div>
                <div className={`${styles.skelPrice} ${styles.skeletonShimmer}`}></div>
                <div className={`${styles.skelButton} ${styles.skeletonShimmer}`}></div>
            </div>
        </div>
    )
}
