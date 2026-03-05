import React from 'react'
import style from './Input.module.css'

export default function Input({ type, onChange, placeholder = '' ,value}) {
    return (
        <input
            className={style.input}
            type={type}
            onChange={onChange}j
            placeholder={placeholder}
            value={value}
        />
    )
}
