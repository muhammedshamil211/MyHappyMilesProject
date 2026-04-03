import React from 'react'
import { useNavigate } from 'react-router-dom';
import style from './AdminPackageCard.module.css'

export default function AdminPackageCard({ pack, onEdit, onDelete }) {

    const navigate = useNavigate();
    // Resolve image: prefer new images[] array, fall back to legacy image string
    const thumbnail = pack.images?.[0] || pack.image || '';

    return (
        <div className={style.card}>
            <div className={style.imageDiv}>
                <img src={thumbnail} alt={pack.title} />
            </div>
            <h1 className={style.detHead}>Details</h1>
            <hr />
            <div className={style.detailContainer}>
                <div className={style.detailsDiv}>
                    <h4>Name</h4>
                    <p>: {pack.title}</p>
                </div>
                <div className={style.detailsDiv}>
                    <h4>Description</h4>
                    <p>: {pack.description}</p>
                </div>
                <div className={style.detailsDiv}>
                    <h4>Duration</h4>
                    <p>: {pack.duration}</p>
                </div>
                <div className={style.detailsDiv}>
                    <h4>Price</h4>
                    <p>: ₹{pack.price}</p>
                </div>
                <div className={style.buttonDiv}>
                    <button className={style.edit} onClick={onEdit}>Edit</button>
                    <button
                        className={style.details}
                        onClick={() => navigate(`/admin/package/${pack._id}/details`)}
                    >
                        Add Details
                    </button>
                    <button className={style.delete} onClick={onDelete}>Delete</button>
                </div>
            </div>
        </div>
    )
}
