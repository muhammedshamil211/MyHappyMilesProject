import React, { createContext ,useState } from 'react'
import { useEffect } from 'react';

export const PlaceContext = createContext();

export const PlaceProvider = ({children}) =>{
    const [category, setCategory] = useState('international');
        const [placeList, setPlaceList] = useState([]);
    
        const handlePlace = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/v1/places`);
    
                const data = await res.json();
                setPlaceList(data.data.places);
            } catch (err) {
                alert(err);
            }
    
        }
    
        useEffect(() => {
            handlePlace();
        }, [category]);

        return(
            <PlaceContext.Provider value={{placeList,category,setCategory}}>
                {children}
            </PlaceContext.Provider>
        );

};
