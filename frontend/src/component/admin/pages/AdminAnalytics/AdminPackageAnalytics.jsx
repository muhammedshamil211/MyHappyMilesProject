import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './AdminPackageAnalytics.module.css';
import * as analyticsService from '../../services/adminAnalyticsService';
import SortFilterBar from '../../shared/SortFilterBar/SortFilterBar';
import TableSkeleton from './TableSkeleton';

export default function AdminPackageAnalytics() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterValues, setFilterValues] = useState({ sortBy: 'totalRevenue', order: 'desc' });
    
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStats();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, page, filterValues]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await analyticsService.getGlobalAnalytics({
                search,
                page,
                ...filterValues
            });
            if (res.success) {
                setPackages(res.data.packages);
                setTotalPages(res.data.pagination.totalPages);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.main}>
            <div className={style.headSection}>
                <h1 className={style.head}>Package Analytics</h1>
                <div className={style.controls}>
                    <input 
                        type="search" 
                        placeholder="Search packages..." 
                        className={style.searchInput}
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                    <SortFilterBar 
                        values={filterValues}
                        onChange={(key, val) => {
                            setFilterValues(prev => ({ ...prev, [key]: val }));
                            setPage(1);
                        }}
                        onReset={() => { setFilterValues({ sortBy: 'totalRevenue', order: 'desc' }); setPage(1); }}
                        sorts={[
                            { label: 'Revenue (High)', value: 'totalRevenue' },
                            { label: 'Bookings (High)', value: 'totalBookings' },
                            { label: 'Rating (High)', value: 'averageRating' },
                            { label: 'Views (High)', value: 'views' },
                            { label: 'Conversion (High)', value: 'conversionRate' }
                        ]}
                    />
                </div>
            </div>

            <div className={style.tableWrapper}>
                <table className={style.table}>
                    <thead>
                        <tr>
                            <th>Package Name</th>
                            <th>Total Bookings</th>
                            <th>Total Revenue</th>
                            <th>Rating</th>
                            <th>Reviews</th>
                            <th>Views</th>
                            <th>Conv. Rate</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <TableSkeleton rows={10} cols={8} />
                        ) : packages.length === 0 ? (
                            <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No data found</td></tr>
                        ) : (
                            packages.map((pkg) => (
                                <tr key={pkg._id}>
                                    <td className={style.pkgTitle}>{pkg.title}</td>
                                    <td>{pkg.totalBookings}</td>
                                    <td className={style.revenue}>₹{pkg.totalRevenue?.toLocaleString()}</td>
                                    <td>
                                        <div className={style.rating}>
                                            <span className={style.star}>⭐</span>
                                            {pkg.averageRating ? pkg.averageRating.toFixed(1) : 'N/A'}
                                        </div>
                                    </td>
                                    <td>{pkg.totalReviews}</td>
                                    <td>{pkg.views || 0}</td>
                                    <td>
                                        <span className={style.convBadge}>
                                            {pkg.conversionRate ? pkg.conversionRate.toFixed(1) : 0}%
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className={style.viewBtn}
                                            onClick={() => navigate(`/admin/package-analytics/${pkg._id}`)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className={style.pagination}>
                        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                        <span>Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                    </div>
                )}
            </div>
        </div>
    );
}
