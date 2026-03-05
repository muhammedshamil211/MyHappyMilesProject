import React, { useContext, useState } from 'react'
import Button from '../ui/button/Button'
import BookingPage from '../../../user/components/bookingForm/BookingPage'
import { LoginContext, LoginProvider } from '../../../../context/LoginContext';
import style from './PackageCard.module.css'

function PackageCard({ packagePlace, placeName }) {

    const [showForm, setShowForm] = useState(false);
    const { setLogin } = useContext(LoginContext);


    const handleBooking = async () => {

        const user = localStorage.getItem("user");

        if (!user) {
            setLogin(true)
            alert("Please Login first");
            return;
        }


        try {
            // We don't necessarily need to wait for this to finish to show the form,
            // so we don't 'await' it if we want maximum speed, 
            // but usually, it's safer to keep it async.
            await fetch(`http://localhost:5000/api/packages/view/${packagePlace._id}`, {
                method: "PUT",
            });
        } catch (err) {
            console.error("Failed to increment view count", err);
        }

        setShowForm(true);

    }


    return (
        <>
            <div className={style.packageCard}>
                <div className={style.imageDiv}>
                    <img src={packagePlace.image} className={style.image} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.contents}>
                        <p className={style.title}>{packagePlace.title}</p>
                        <p className={style.day}>{packagePlace.duration}</p>
                        <p className={style.rateText}>Starts from  <span className={style.rate}> ${packagePlace.price}</span></p>
                        <div className={style.buttonDiv}>
                            <Button text={"Book Now"} onClick={handleBooking} />
                        </div>
                    </div>
                </div>
            </div>
            {showForm && (
                <BookingPage
                    packages={packagePlace}
                    placeName={placeName}
                    closeForm={() => setShowForm(false)}
                />

            )}
        </>
    )
}

export default React.memo(PackageCard);