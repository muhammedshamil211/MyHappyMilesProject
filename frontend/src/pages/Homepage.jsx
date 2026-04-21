import React, { useContext } from 'react';
import Landing from '../component/user/components/landing/Landing';
import Place from '../component/user/components/PlaceSection/Place';
import Package from '../component/user/components/packageSection/Package';
import RecentPack from '../component/user/components/recentPack/RecentPack'
import Terms from '../component/user/components/terms/Terms'
import Footer from '../component/user/layout/footer/Footer';
import { PlaceContext } from '../component/user/context/PlaceContext';


function Homepage() {
    const { placeList } = useContext(PlaceContext);
    // console.log(placeList)
    const random = Math.floor(Math.random() * placeList.length);
    const packages = placeList[random];
    console.log(packages);
    return (
        <div className='m-1 md:m-4 lg:m-6'>
            <Landing />
            <Place />
            {/* <Package place={packages} /> */}
            <RecentPack />
            <Terms />
            <Footer />
        </div>
    )
}

export default Homepage