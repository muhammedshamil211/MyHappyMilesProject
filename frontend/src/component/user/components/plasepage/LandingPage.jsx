import React from 'react'
import Nav from '../../layout/Nav/Nav'
function LandingPage({ place }) {
    return (
        <div>
            <div className=' relative md:h-[400px] h-[300px] rounded-3xl bg-no-repeat bg-cover bg-center m-2' style={{ backgroundImage: `url(${place.coverImage})` }} >

                {/* overlay leyer */}
                <div className='absolute inset-0 bg-black/50 rounded-3xl '></div>

                {/* Contents-- */}
                <div className=' bg-transparent h-full p-2 md:p-5 flex flex-col justify-between '>
                    <Nav />
                    <div className='flex flex-col items-center z-20'>
                        <p className='text-[2.5rem] md:text-6xl font-bold text-white'>{place.name} <span className='text-[2rem] md:text-4xl font-semibold '>Packages</span></p>
                        <p className='text-[1rem] text-white'>Trending Fixed Departure Itinerary</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default LandingPage