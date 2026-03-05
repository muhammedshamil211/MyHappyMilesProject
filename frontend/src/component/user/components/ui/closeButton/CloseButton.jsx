import React from 'react'
import style from './CloseButton.module.css'

export default function CloseButton({onClick}) {
  return (
    <div className={style.button} onClick={onClick}>x</div>
  )
}
