import React from 'react'
import style from './AdminPlaceCard.module.css'
import EditPlace from '../PlaceForm/PlaceForm';
import { Link } from 'react-router-dom';


export default function AdminPlaceCard({ place, onPreview, onEdit, onDelete }) {



  return (
    <div className={style.card}>
      <h1 className={style.head}>{place.name}</h1>
      <hr />

      <div className={style.imageGrid}>
        <div className={style.cardRow}>
          <p className={style.p}>Profile picture -</p>
          <p className={style.p2}>click the button to preview the image</p>
          <button
            className={style.preview}
            onClick={() => onPreview(place.image)}
          >
            preview image
          </button>
        </div>

        <div className={style.cardRow}>
          <p className={style.p}>CoverImage -</p>
          <p className={style.p2}>click the button to preview the image</p>
          <button
            className={style.preview}
            onClick={() => onPreview(place.coverImage)}
          >
            preview image
          </button>
        </div>
      </div>
      <div className={style.cardRow}>
        <p className={style.p}>Packages -</p>
        <Link to={`/admin/places/${place.name}`}><button className={`${style.edit} ${style.button}`}>Open Packages</button></Link>
      </div>
      <div className={style.actionDiv}>
        <button className={`${style.edit} ${style.button} `} onClick={onEdit}>Edit</button>
        <button className={`${style.delete} ${style.button} `} onClick={onDelete}>Delete</button>
      </div>


    </div>
  )
}