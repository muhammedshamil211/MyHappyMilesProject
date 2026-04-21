import React, { createContext, useState, useCallback } from 'react';
import { useEffect } from 'react';

export const AdminPlaceContext = createContext();

const LIMIT = 6;

export const AdminPlaceProvider = ({ children }) => {

    const [adminPlaceList, setAdminPlaceList] = useState([]);
    const [category, setCategory] = useState('international');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [filterValues, setFilterValues] = useState({ sortBy: 'newest' });

    const handlePlace = useCallback(async (pageArg) => {
        try {
            setLoading(true);
            const { sortBy } = filterValues;
            const targetPage = pageArg || currentPage;

            const params = new URLSearchParams({ 
                page: targetPage, 
                limit: LIMIT,
                ...(sortBy && { sortBy })
            });
            if (category && category !== 'all') params.set('category', category);

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/places?${params}`);
            const data = await res.json();

            if (data.success) {
                setAdminPlaceList(data.data.places);
                setTotalPages(data.data.pagination.totalPages);
                setTotal(data.data.pagination.total);
                setCurrentPage(data.data.pagination.page);
            }

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [category, filterValues, currentPage]);

    // Re-fetch when category or filters change — reset to page 1
    useEffect(() => {
        handlePlace(1);
    }, [category, filterValues]);

    // Re-fetch when page changes (but NOT on category change — that's handled above)
    const goToPage = (page) => {
        setCurrentPage(page);
        handlePlace(page);
    };

    return (
        <AdminPlaceContext.Provider value={{
            adminPlaceList,
            category,
            setCategory,
            handlePlace,
            loading,
            currentPage,
            totalPages,
            total,
            goToPage,
            filterValues,
            setFilterValues
        }}>
            {children}
        </AdminPlaceContext.Provider>
    );

};
