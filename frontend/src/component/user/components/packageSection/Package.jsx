import React, { useState, useEffect, useCallback } from 'react'
import PackageCard from '../packageCard/PackageCard'
import styles from './Package.module.css'
import PackageSkelton from '../Skelton/PackageSkelton/PackageSkelton';

const LIMIT = 6;

function Package({ place }) {

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePackages = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/packages/${place._id}?page=${page}&limit=${LIMIT}`
      );

      const data = await res.json();
      if (data.success) {
        setPackages(data.data.packages);
        setTotalPages(data.data.pagination.totalPages);
        setCurrentPage(data.data.pagination.page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [place._id]);

  useEffect(() => {
    if (place?._id) {
      handlePackages(1);
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
            key={pack._id || pack.name}
            packagePlace={pack}
            placeName={place.name}
          />
        ))}
      </div>

      {/* Pagination controls — only shown when there are multiple pages */}
      {!loading && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={currentPage === 1}
            onClick={() => handlePackages(currentPage - 1)}
          >
            ← Prev
          </button>
          <span className={styles.pageInfo}>
            {currentPage} / {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            disabled={currentPage === totalPages}
            onClick={() => handlePackages(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default Package