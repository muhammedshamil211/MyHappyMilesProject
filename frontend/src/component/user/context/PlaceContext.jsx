import React, { createContext, useState, useCallback } from 'react';
import { useEffect } from 'react';

export const PlaceContext = createContext();

export const PlaceProvider = ({ children }) => {
    const [category, setCategory] = useState('international');
    const [placeList, setPlaceList] = useState([]);
    const [loading, setLoading] = useState(false);

    const handlePlace = useCallback(async () => {
        try {
            setLoading(true);

            // Fetch all places for the selected category — no pagination needed
            // (this is displayed as a horizontal scroll carousel)
            const params = new URLSearchParams({ limit: 100 });
            if (category && category !== 'all') params.set('category', category);

            const res = await fetch(`http://localhost:5000/api/v1/places?${params}`);
            const data = await res.json();

            if (data.success) {
                setPlaceList(data.data.places);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        handlePlace();
    }, [category]);

    return (
        <PlaceContext.Provider value={{
            placeList,
            category,
            setCategory,
            loading,
        }}>
            {children}
        </PlaceContext.Provider>
    );
};
