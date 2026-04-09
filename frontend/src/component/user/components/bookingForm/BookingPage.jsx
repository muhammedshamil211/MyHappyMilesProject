import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Button from '../ui/button/Button'
import Popup from '../../layout/Popup/Popup';
import FormDiv from '../../layout/form/FormDiv'
import CloseButton from '../ui/closeButton/CloseButton';
import Input from '../ui/inputArea/Input';
import style from './BookingPage.module.css'

export default function BookingPage({ packages, placeName, closeForm }) {

    const [date, setDate] = useState('');
    const [count, setCount] = useState('');
    const [phone, setPhone] = useState('');

    const handleBooking = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/v1/booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    packageId: packages._id,
                    phone,
                    date,
                    count
                })
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
                closeForm();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Booking failed")
        }
    }


    return (
        <Popup
            onClick={closeForm}
        >
            <FormDiv>
                <CloseButton onClick={closeForm} />
                <h2 className={style.heading}>{packages.title}</h2>

                <h2>{placeName}</h2>

                <div className={style.bookingInputs}>

                    <div className={style.bookingRow}>
                        <p>Select Date:</p>
                        <Input
                            type="date"
                            onChange={(e) => {
                                setDate(e.target.value)
                            }}
                        />
                    </div>
                    <div className={style.bookingRow}>
                        <p>Number of adult:</p>
                        <Input
                            type="number"
                            onChange={(e) => {
                                setCount(e.target.value)
                            }} />
                    </div>
                    <div className={style.bookingRow}>
                        <p>Phone:</p>
                        <Input
                            type="text"
                            onChange={(e) => {
                                setPhone(e.target.value)
                            }}
                        />
                    </div>

                    <div className='mt-6'>
                        <Button text={"Confirm Booking"} onClick={handleBooking} />
                    </div>
                </div>
            </FormDiv>
        </Popup>

    )
}
