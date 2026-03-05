import React, { useContext } from 'react'
import LandingPage from '../component/user/components/plasepage/LandingPage'
import Place from '../component/user/components/PlaceSection/Place'
import Footer from '../component/user/layout/footer/Footer'
import Package from '../component/user/components/packageSection/Package'
import { useParams } from 'react-router-dom'
import { PlaceContext } from '../component/user/context/PlaceContext'


export const PlacePage = () => {
    const { name } = useParams();

    console.log(name);
    const { placeList } = useContext(PlaceContext);

    const place = placeList.find(p => p.name === name) || placeList[0];

    console.log(place)


    // const place1 = places.find((p) => (p.name.trim().toLocaleLowerCase() === name.trim().toLocaleLowerCase()));
    if (!place) {
        return <div className="p-10 text-red-500">Place not found</div>;
    }

    return (
        <div>
            <LandingPage place={place} />
            <Place />
            <Package place={place} />
            <Footer />
        </div>
    )
}

