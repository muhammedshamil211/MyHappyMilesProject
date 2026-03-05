import React from 'react'
import style from './Popup.module.css'

export default function Popup({ children, onClick }) {
  return (
    <div
      className={style.popup}
      onDoubleClick={onClick}
    >
      {children}
    </div>
  )
}
