import React from 'react'
import style from './AdminPlaceCard.module.css'
import EditPlace from '../PlaceForm/PlaceForm';
import { Link } from 'react-router-dom';


export default function AdminPlaceCard({ place, onPreview, onEdit, onDelete }) {



  return (
    <div className={style.card}>
      <div className={style.imageHeader}>
        <img src={place.image} alt={place.name} className={style.mainImage} />
        <div className={style.badge}>{place.category}</div>
        <div className={style.imageOverlay}>
          <button 
            className={style.previewBtn} 
            onClick={() => onPreview(place.image)}
            title="Preview Main Image"
          >
            👁️
          </button>
          <button 
            className={style.previewBtn} 
            onClick={() => onPreview(place.coverImage)}
            title="Preview Cover Image"
          >
            🖼️
          </button>
        </div>
      </div>
      
      <div className={style.cardContent}>
        <h3 className={style.cardTitle}>{place.name}</h3>
        
        <div className={style.statsRow}>
           <Link to={`/admin/places/${place.name}`} className={style.packageLink}>
             <span>📦 Open Packages</span>
           </Link>
        </div>

        <div className={style.actionRow}>
          <button className={style.btnEdit} onClick={onEdit}>Edit</button>
          <button className={style.btnDelete} onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  )
}