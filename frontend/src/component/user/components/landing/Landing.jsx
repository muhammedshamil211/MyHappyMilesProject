import React, { useContext } from 'react'
import Nav from '../../layout/Nav/Nav'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { PlaceContext } from '../../context/PlaceContext';

function Landing() {

  const { placeList } = useContext(PlaceContext);
  const [search, setSearch] = useState('');
  const [result, setResult] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value === "") {
      setResult([]);
      return;
    }

    const filterd = placeList.filter((place) => place.name.toLowerCase().includes(value.toLowerCase()));

    setResult(filterd);
  }

  const goToPlace = (name) => {
    setSearch('');
    setResult([]);
    navigate(`/place/${name}`);
  }

  return (
    <>
      <div className='bg-[url("landing.jpg")] relative bg-top   md:h-[500px] h-[450px] rounded-2xl md:rounded-3xl' >

        {/* overlay leyer */}
        <div className='absolute inset-0 bg-black/50 rounded-2xl md:rounded-3xl '></div>

        {/* Contents-- */}
        <div className=' bg-transparent h-full p-2 md:p-5 flex flex-col'>
          <Nav />
          <div className='flex justify-center z-10 mt-20 '>
            <div className='flex flex-col justify-between h-full items-center w-full '>
              <div className='relative flex bg-white md:w-[50vw] w-[92vw] rounded-[1rem] md:rounded-4xl'>
                <input type="text" placeholder='Enter your dream destination' className='bg-white p-2 md:p-5  w-full rounded-2xl md:rounded-4xl border-none outline-none focus:outline-none focus:border-none text-[0.8rem]'
                  value={search}
                  onChange={handleSearch}
                />
                {(result.length > 0 && (
                  <div className='absolute top-full bg-white w-full  rounded-[1rem]'>

                    {result.map((place) => (
                      <p
                        onClick={() => goToPlace(place.name)}
                        className='p-3 hover:bg-orange-100 cursor-pointer rounded-[1rem]'
                      >
                        {place.name}
                      </p>
                    ))}

                  </div>
                ))}
              </div>
              <div className='mt-20 md:mt-32 text-center text-white px-2'>
                <h2 className='text-lg md:text-2xl font-light mb-1'>
                  Take only <span className='text-3xl md:text-6xl font-bold block md:inline mt-1 md:mt-0'>Memories</span>
                </h2>
                <h2 className='text-lg md:text-2xl font-light'>
                  <span className='text-3xl md:text-6xl font-bold block md:inline mb-1 md:mb-0'>Leave</span> only footprints
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Landing