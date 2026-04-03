import React, { useState, useEffect } from 'react'
import PackageCard from '../packageCard/PackageCard'
import styles from './Package.module.css'
import PackageSkelton from '../Skelton/PackageSkelton/PackageSkelton';

function Package({ place }) {

  console.log("message from ", place?._id)

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const handlePackages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/v1/packages/${place._id}`);

      const data = await res.json();
      if (data.success) {
        setPackages(data.data.packages);
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    if (place?._id) {
      handlePackages();
    }
  }, [place]);

  return (
    <div className={styles.container}>
      <p className={styles.heading}>
        {place?.name}
        <span className={styles.subHeading}>Tour Packages</span>
      </p>

      <div className={styles.grid}>
        {loading ? Array(3).fill(0).map((_, i) => (
          <PackageSkelton key={i} />
        )) : packages.map((pack) => (
          <PackageCard
            key={pack.id || pack.name}
            packagePlace={pack}
            placeName={place.name}
          />
        ))}
      </div>
    </div>
  )
}

export default Package