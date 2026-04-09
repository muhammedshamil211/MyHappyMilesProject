import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
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
        loading,
        currentPage,
        totalPages,
        goToPage,
    } = useContext(AdminPlaceContext);


    const [previewUrl, setPreviewUrl] = useState(null);
    const [animate, setAnimate] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [place, setPlace] = useState(null);
    const [deletePlace, setDeletePlace] = useState(null);

    // Animate on page/category change
    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 500);
        return () => clearTimeout(timer);
    }, [category, currentPage]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:5000/api/v1/places/${deletePlace._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await res.json();
            if (data.success) {
                toast.success("Place deleted successfully");
                handlePlace(currentPage);
                setDeletePlace(null);
            } else {
                toast.error(data.message || "Failed to delete place");
            }

        } catch (err) {
            toast.error("Error deleting place");
            console.log(err);
        }
    };

    return (
        <div className={style.main}>
            <div className={style.headSection}>
                <h1 className={style.head}>Places</h1>
                <div>
                    <div className={style.addButton}>
                        <h4 className={style.h4}>Add Place</h4>
                        <span
                            className={style.plusButton}
                            onClick={() => {
                                setPlace(null);
                                setFormOpen(true);
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

                {adminPlaceList.length === 0 && !loading
                    ? <p>Place not found</p>
                    : adminPlaceList.map(place => (
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

            {/* Server-driven pagination */}
            {totalPages > 1 && (
                <div className={style.paginaton}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => goToPage(currentPage - 1)}
                    >
                        prev
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1;
                        return (
                            <button
                                key={index}
                                onClick={() => goToPage(pageNumber)}
                                className={currentPage === pageNumber ? style.active : ''}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

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
                            handlePlace(currentPage);
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