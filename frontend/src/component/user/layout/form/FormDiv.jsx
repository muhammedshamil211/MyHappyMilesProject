import React from 'react'
import style from './FormDiv.module.css'

export default function Form({children ,padd=0}) {
  return (
    <div 
      className={style.form} 
      style={{padding:`${padd}px`}}
    >{children}</div>
  )
}
