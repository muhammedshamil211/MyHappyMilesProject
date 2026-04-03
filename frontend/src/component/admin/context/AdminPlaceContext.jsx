import React, { createContext, useState } from 'react'
import { useEffect } from 'react';

export const AdminPlaceContext = createContext();

export const AdminPlaceProvider = ({ children }) => {

    const [adminPlaceList, setAdminPlaceList] = useState([]);
    const [category, setCategory] = useState('international');
    const [loading, setLoading] = useState(false);


    const handlePlace = async () => {
        // e.preventDefault();
        try {
            setLoading(true);

            const res = await fetch(`http://localhost:5000/api/v1/places`);

            const data = await res.json();

            if (data.success) {
                setAdminPlaceList(data.data.places);
            }


        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        handlePlace();
    }, [category]);

    return (
        <AdminPlaceContext.Provider value={{
            adminPlaceList,
            category,
            setCategory,
            handlePlace,
            loading
        }}>
            {children}
        </AdminPlaceContext.Provider>
    );

};
