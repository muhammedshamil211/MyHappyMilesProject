import React, { useState, useEffect } from 'react'
import PackageCard from '../packageCard/PackageCard'
import styles from '../packageSection/Package.module.css'
import { PackageSearchIcon } from 'lucide-react';

function PackageStats() {
    const [recentPackages, setRecentPackages] = useState([]);
    const [popularPackages, setPopularPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const [resRecent, resPopular] = await Promise.all([
                fetch('http://localhost:5000/api/v1/packages/recent'),
                fetch('http://localhost:5000/api/v1/packages/popular')
            ]);

            const [dataRecent, dataPopular] = await Promise.all([
                resRecent.json(),
                resPopular.json()
            ]);

            if (dataRecent.success && dataPopular.success) {
                setRecentPackages(dataRecent.data.packages);
                setPopularPackages(dataPopular.data.packages);
            }

        } catch (err) {
            console.error("Error fetching stats:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className={styles.container}>
            {/* --- Recently Added Section --- */}
            <div style={{ marginBottom: '4rem' }}>
                <p className={styles.heading}>
                    Recently Added
                    <span className={styles.subHeading}>Fresh Destinations</span>
                </p>
                <div className={styles.grid}>
                    {loading ? Array(3).fill(0).map((_, i) => (
                        <PackageSearchIcon key={i} />
                    )) : recentPackages.map((pack) => (
                        <PackageCard
                            key={pack._id}
                            packagePlace={pack}
                            placeName={pack.placeName || "Explore"}
                        />
                    ))}
                </div>
            </div>

            {/* --- Most Viewed Section --- */}
            <div>
                <p className={styles.heading}>
                    Most Viewed
                    <span className={styles.subHeading}>Trending Now</span>
                </p>
                <div className={styles.grid}>
                    {loading ? Array(3).fill(0).map((_, i) => (
                        <PackageSearchIcon key={i} />
                    )) : popularPackages.map((pack) => (
                        <PackageCard
                            key={pack._id}
                            packagePlace={pack}
                            placeName={pack.placeName || "Explore"}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PackageStats;