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

    const handlePlace = useCallback(async (page = currentPage) => {
        try {
            setLoading(true);

            const params = new URLSearchParams({ page, limit: LIMIT });
            if (category && category !== 'all') params.set('category', category);

            const res = await fetch(`http://localhost:5000/api/v1/places?${params}`);
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
    }, [category, currentPage]);

    // Re-fetch when category changes — reset to page 1
    useEffect(() => {
        setCurrentPage(1);
        handlePlace(1);
    }, [category]);

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
        }}>
            {children}
        </AdminPlaceContext.Provider>
    );

};
