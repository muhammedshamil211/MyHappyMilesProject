import React, { useContext, useEffect, useState } from 'react'
import { AdminPlaceContext } from '../../context/AdminPlaceContext'
import style from './AdminPlace.module.css'
import AdminPlaceCard from '../../components/PlaceCard/AdminPlaceCard'
import PreviewImage from '../../components/previwImage/PreviewImage'
import PlaceForm from '../../components/PlaceForm/PlaceForm'
import DeleteConfirm from '../../components/deleteConformation/DeletePlace'


export default function AdminPlace() {

    const {
        adminPlaceList,
        category,
        setCategory,
        handlePlace,
        loading
    } = useContext(AdminPlaceContext);


    const [previewUrl, setPreviewUrl] = useState(null);
    const [animate, setAnimate] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [place, setPlace] = useState(null);
    const [deletePlace, setDeletePlace] = useState(null)

    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');


    const filterdPlace = adminPlaceList.filter(place => {
        const matchesCategory = category === 'all' ? place : place.category === category;
        const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 6;

    const totalPages = Math.ceil(filterdPlace.length / itemPerPage);

    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;

    const currentPlaces = filterdPlace.slice(startIndex, endIndex);

    console.log('totalPage', totalPages, '--currentPage', currentPage);

    const handleSearch = () => {
        setSearchQuery(search);
        setCurrentPage(1);
    }

    useEffect(() => {
        setCurrentPage(1);
        setSearch('');
        setSearchQuery('');
    }, [category]);

    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => {
            setAnimate(false);
        }, 500);

        return () => clearTimeout(timer)
    }, [category, currentPage]);



    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:5000/api/places/${deletePlace._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await res.json();
            if (data.success) {
                handlePlace();
                setDeletePlace(null);
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={style.main}>
            <div className={style.headSection}>
                <h1 className={style.head}>Places</h1>
                <div className={style.searchBar}>
                    <input
                        type="text"
                        placeholder='Enter place name'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className={style.searchInput}
                    />
                    <button
                        onClick={handleSearch}
                        className={style.searchButton}
                    >Search</button>
                    <button
                        onClick={() => {
                            setSearch('');
                            setSearchQuery('');
                        }}
                        className={style.clearButton}
                    >clear</button>
                </div>
                <div>
                    <div className={style.addButton}>
                        <h4 className={style.h4}>Add Place</h4>
                        <span
                            className={style.plusButton}
                            onClick={() => {
                                console.log("Clicked");
                                setPlace(null);
                                setFormOpen(true);
                                console.log(formOpen)
                            }}
                        >+</span>
                    </div>
                </div>
            </div>
            <hr />
            <ul className={style.category}>
                <li
                    onClick={() => setCategory('all')}
                    className={category === 'all' ? style.active : ''}
                >
                    All
                </li>
                <li
                    onClick={() => setCategory('international')}
                    className={category === 'international' ? style.active : ''}
                >
                    International
                </li>

                <li
                    onClick={() => setCategory('domestic')}
                    className={category === 'domestic' ? style.active : ''}
                >
                    Domestic
                </li>
            </ul>


            {loading && <p>Loading.....</p>}


            <div className={`${style.grid} ${animate ? style.animate : ''}`} key={`${category}-${currentPage}`}>


                {currentPlaces.length === 0 ? <p>Place not found</p> : currentPlaces.map(place => (
                    <AdminPlaceCard
                        key={place._id}
                        place={place}
                        onPreview={(url) => setPreviewUrl(url)}
                        onEdit={() => {
                            setPlace(place);
                            setFormOpen(true);
                        }}
                        onDelete={() => setDeletePlace(place)}
                    />
                ))}
            </div>


            <div className={style.paginaton}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                >
                    prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    return (<button
                        key={index}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={currentPage === pageNumber ? style.active : ''}
                    >
                        {index + 1}
                    </button>
                    )
                })}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}

                >
                    Next
                </button>
            </div>

            {
                previewUrl && (
                    <PreviewImage
                        url={previewUrl}
                        onClose={() => setPreviewUrl(null)}
                    />
                )
            }
            {
                formOpen && (
                    <PlaceForm
                        place={place}
                        onClose={() => {
                            setFormOpen(false);
                            setPlace(null);
                        }}
                        onSuccess={() => {
                            handlePlace();
                            setFormOpen(false);
                            setPlace(null);
                        }}
                    />
                )
            }

            {
                deletePlace && (
                    <DeleteConfirm
                        onClose={() => setDeletePlace(null)}
                        onConfirm={handleDelete}
                    />
                )
            }
        </div >
    )
}