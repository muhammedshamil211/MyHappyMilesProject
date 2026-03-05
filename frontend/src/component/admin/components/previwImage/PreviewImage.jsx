import React from 'react'
import Popup from '../../../user/layout/Popup/Popup'
import CloseButton from '../../../user/components/ui/closeButton/CloseButton'
import style from './PreviewImage.module.css'

export default function PreviewImage({ url, onClose }) {

    if (!url) return null;

    return (
        <Popup>
            <div
                className={style.container}
                onDoubleClick={(e) => e.stopPropagation()}
            >
                <div className={style.image}>
                    <CloseButton onClick={onClose} />
                    <img src={url} alt="image preview" />
                </div>
            </div>
        </Popup>
    )
}