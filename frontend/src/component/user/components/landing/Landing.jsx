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
      <div className='bg-[url("landing.jpg")] relative bg-top   md:h-[500px] h-[450px] rounded-3xl' >

        {/* overlay leyer */}
        <div className='absolute inset-0 bg-black/50 rounded-3xl '></div>

        {/* Contents-- */}
        <div className=' bg-transparent h-full p-2 md:p-5 flex flex-col'>
          <Nav />
          <div className='flex justify-center z-10 mt-20 '>
            <div className='flex flex-col justify-between h-full items-center w-[90%]  '>
              <div className='relative flex bg-white md:w-[50vw] w-[80vw] rounded-[1rem] md:rounded-4xl'>
                <input type="text" placeholder='Enter your dream destination' className='bg-white p-2 md:p-5  w-[90%] rounded-2xl md:rounded-4xl border-none outline-none focus:outline-none focus:border-none text-[0.8rem]'
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
              <div className='mt-40 '>
                <p className='text-white md:text-2xl md:ml-[9vw] md:-mb-6 ml-[11vw] -mb-2.5'>Take only <span className='md:text-5xl text-2xl'>   Memories</span></p>
                <p className='text-white'> <span className='md:text-5xl text-2xl'>Leave</span> only <span >footprints</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Landing