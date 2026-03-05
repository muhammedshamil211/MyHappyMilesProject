import Popup from "../../../user/layout/Popup/Popup";
import style from "./DeletePlace.module.css"
import FormDiv from "../../../user/layout/form/FormDiv"

export default function DeleteConfirm({ onClose, onConfirm }) {
    return (
        <Popup onClick={onClose}>
            <FormDiv
                padd={25}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className={style.h3}>Are you sure?</h3>
                <p className={style.p}>This action cannot be undone.</p>

                <div className={style.buttonDiv}>
                    <button onClick={onConfirm} className={`${style.button} ${style.buttonRed}`}>Yes, Delete</button>
                    <button onClick={onClose} className={`${style.button} ${style.buttonGreen}`}>Cancel</button>
                </div>
            </FormDiv>
        </Popup >
    );
}