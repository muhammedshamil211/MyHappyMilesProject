import React, { useState, useEffect, useContext } from 'react';
import Nav from '../component/user/layout/Nav/Nav';
import Footer from '../component/user/layout/footer/Footer';
import PackageCard from '../component/user/components/packageCard/PackageCard';
import { PlaceContext } from '../component/user/context/PlaceContext';
import styles from './PackagesPage.module.css';

const PackagesPage = () => {
    const { placeList } = useContext(PlaceContext);
    
    // State for packages and meta
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
    });

    const [filters, setFilters] = useState({
        search: '',
        placeId: '',
        sort: 'date_desc',
        page: 1
    });

    const FALLBACK_IMAGES = [
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1600"
    ];

    // Banner Slideshow State
    const [bannerImages, setBannerImages] = useState(FALLBACK_IMAGES);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    // Extract images from packages
    useEffect(() => {
        if (packages.length > 0) {
            const extracted = packages
                .map(pkg => pkg.images?.[0] || pkg.image)
                .filter(img => img);
            
            const unique = [...new Set(extracted)];
            if (unique.length > 0) {
                setBannerImages(unique.slice(0, 8));
            } else {
                setBannerImages(FALLBACK_IMAGES);
            }
        }
    }, [packages]);

    // Timer for slideshow
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImgIndex(prev => (prev + 1) % bannerImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [bannerImages]);

    // Fetch packages
    const fetchPackages = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                search: filters.search,
                placeId: filters.placeId,
                sort: filters.sort,
                page: filters.page,
                limit: 12
            });

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/packages/all?${params}`);
            const data = await res.json();

            if (data.success) {
                setPackages(data.data.packages);
                setPagination(data.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching packages:", error);
        } finally {
            setLoading(false);
        }
    };

    // Trigger fetch on filter change (debounce search later if needed)
    useEffect(() => {
        fetchPackages();
        window.scrollTo(0, 0);
    }, [filters.placeId, filters.sort, filters.page]);

    // Handle search with separate debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (filters.page !== 1) {
                setFilters(prev => ({ ...prev, page: 1 }));
            } else {
                fetchPackages();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [filters.search]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            page: name === 'page' ? value : 1 // Reset to page 1 on new filter
        }));
    };

    return (
        <div className={styles.pageWrapper}>
            
            
            {/* ── Banner Section ── */}
            <header 
                className={styles.banner}
                style={{ backgroundImage: `url(${bannerImages[currentImgIndex]})` }}
            >
                <div className={styles.bannerOverlay}>
                    <Nav />
                    <div className={styles.bannerContent}>
                        <h1 className={styles.bannerTitle}>Explore All Tour Packages</h1>
                        <p className={styles.bannerSubtitle}>Find your next adventure from our curated list of destinations worldwide.</p>
                    </div>
                </div>
            </header>

            <main className={styles.container}>
                {/* ── Filter & Sort Bar ── */}
                <section className={styles.filterBar}>
                    <div className={styles.searchGroup}>
                        <div className={styles.inputWrapper}>
                            <input 
                                type="text" 
                                name="search"
                                className={styles.input}
                                placeholder="🔍 Search packages..."
                                value={filters.search}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>

                    <div className={styles.selectGroup}>
                        <select 
                            name="placeId" 
                            className={styles.select}
                            value={filters.placeId}
                            onChange={handleFilterChange}
                        >
                            <option value="">🌎 All Destinations</option>
                            {placeList.map(place => (
                                <option key={place._id} value={place._id}>{place.name}</option>
                            ))}
                        </select>

                        <select 
                            name="sort" 
                            className={styles.select}
                            value={filters.sort}
                            onChange={handleFilterChange}
                        >
                            <option value="date_desc">📅 Latest First</option>
                            <option value="popularity_desc">🔥 Most Popular</option>
                            <option value="price_asc">💰 Price: Low to High</option>
                            <option value="price_desc">💰 Price: High to Low</option>
                        </select>
                    </div>
                </section>

                {/* ── Packages Grid ── */}
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {packages.length > 0 ? (
                            packages.map(pkg => (
                                <PackageCard key={pkg._id} packagePlace={pkg} />
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                <h3>No packages found.</h3>
                                <p>Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Pagination ── */}
                {!loading && pagination.totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button 
                            className={styles.pageBtn}
                            disabled={!pagination.hasPrevPage}
                            onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
                        >
                            Previous
                        </button>
                        <span className={styles.pageInfo}>
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button 
                            className={styles.pageBtn}
                            disabled={!pagination.hasNextPage}
                            onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default PackagesPage;
