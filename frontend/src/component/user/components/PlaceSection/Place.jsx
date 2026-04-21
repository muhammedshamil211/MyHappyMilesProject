import React, { useContext } from 'react';
import PlaceCard from '../PlaceCard/PlaceCard';
import PlaceCardSkeleton from '../PlaceCard/PlaceCardSkeleton';
import { PlaceContext } from '../../context/PlaceContext';
import styles from './Place.module.css';

function Place() {

    const { placeList, category, setCategory, loading } = useContext(PlaceContext);

    return (
        <div className={styles.container} id="destinations">
            <p className={styles.heading}>
                Browse <span className={styles.subHeading}>By Categories</span>
            </p>

            <ul className={styles.categoryList}>
                <li
                    onClick={() => setCategory("international")}
                    className={`${styles.categoryItem} ${category === "international" ? styles.activeCategory : ""}`}
                >
                    International
                </li>
                <li
                    onClick={() => setCategory("domestic")}
                    className={`${styles.categoryItem} ${category === "domestic" ? styles.activeCategory : ""}`}
                >
                    Domestic
                </li>
            </ul>

            {/* Horizontal scroll — shows ALL places for the selected category */}
            <div className={styles.scrollDiv}>
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <PlaceCardSkeleton key={i} />)
                ) : placeList.length === 0 ? (
                    <p className={styles.empty}>No places found.</p>
                ) : (
                    placeList.map(place => (
                        <PlaceCard
                            key={place._id}
                            image={place.image}
                            name={place.name}
                            placeId={place._id}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Place;