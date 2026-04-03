import React, { useContext } from 'react';
import PlaceCard from '../PlaceCard/PlaceCard';
import { PlaceContext } from '../../context/PlaceContext';
import styles from './place.module.css';

function Place() {

    const { placeList, category, setCategory, loading } = useContext(PlaceContext);

    return (
        <div className={styles.container}>
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
                {loading
                    ? <p>Loading...</p>
                    : placeList.map(place => (
                        <PlaceCard
                            key={place._id}
                            image={place.image}
                            name={place.name}
                            placeId={place._id}
                        />
                    ))}
            </div>
        </div>
    );
}

export default Place;