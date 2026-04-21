import React, { useContext, useState, useEffect } from 'react'
import LandingPage from '../component/user/components/plasepage/LandingPage'
import Place from '../component/user/components/PlaceSection/Place'
import Footer from '../component/user/layout/footer/Footer'
import Package from '../component/user/components/packageSection/Package'
import { useParams } from 'react-router-dom'
import { PlaceContext } from '../component/user/context/PlaceContext'
import Skeleton from '../component/shared/Skeleton/Skeleton'

export const PlacePage = () => {
    const { name } = useParams();
    const { placeList } = useContext(PlaceContext);
    
    const [localPlace, setLocalPlace] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);

    useEffect(() => {
        const fetchPlaceDetails = async () => {
            const foundInContext = placeList.find(p => p.name.toLowerCase() === name.toLowerCase());
            
            if (foundInContext) {
                setLocalPlace(foundInContext);
                setLocalLoading(false);
            } else {
                try {
                    setLocalLoading(true);
                    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/places?search=${name}&limit=1`);
                    const data = await res.json();
                    if (data.success && data.data.places.length > 0) {
                        setLocalPlace(data.data.places[0]);
                    }
                } catch (err) {
                    console.error("Failed to fetch place", err);
                } finally {
                    setLocalLoading(false);
                }
            }
        };
        fetchPlaceDetails();
    }, [name, placeList]);

    if (localLoading) {
        return (
            <div style={{ padding: '20px' }}>
                <Skeleton height="60vh" variant="card" />
                <div style={{ marginTop: '2rem' }}>
                    <Skeleton width="60%" height="40px" />
                    <Skeleton width="40%" height="20px" style={{ marginTop: '1rem' }} />
                </div>
            </div>
        );
    }

    if (!localPlace) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-red-500 text-2xl font-bold">Place Not Found</h2>
                <p className="text-gray-600 mt-2">We couldn't find the location you're looking for.</p>
                <button onClick={() => window.location.href='/'} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Back to Home</button>
            </div>
        );
    }

    return (
        <div>
            <LandingPage place={localPlace} />
            <Place />
            <Package place={localPlace} />
            <Footer />
        </div>
    )
}
