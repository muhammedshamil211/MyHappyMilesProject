import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import Popup from "../../../user/layout/Popup/Popup";
import style from "./PackageForm.module.css"

export default function PackageForm({ pack, place, onClose, onSuccess }) {

    const isEditMode = !!pack;

    const [formData, setFormData] = useState({
        placeId: place?._id,
        title: '',
        description: '',
        image: '',
        duration: '',
        price: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (pack) {
            setFormData({
                placeId: place?._id,
                title: pack.title,
                description: pack.description,
                image: pack.image,
                duration: pack.duration,
                price: pack.price
            });
        }
    }, [pack]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.image || !formData.duration || !formData.price) {
            toast.error("All fields are required");
            return;
        }

        if (isNaN(formData.price) || formData.price <= 0) {
            toast.error("Please enter a valid price");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const url = isEditMode
                ? `http://localhost:5000/api/v1/packages/${pack._id}`
                : `http://localhost:5000/api/v1/packages`;

            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                console.log("Success! Refreshing list...");
                toast.success("Package created successfully!");
                onSuccess(); 
            } else {
                toast.error(data.message || "Something went wrong");
            }

        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Popup onClick={onClose}>
            <div
                className={style.container}
                onDoubleClick={(e) => e.stopPropagation()}
            >
                <h1 className={style.h1}>{isEditMode ? "Edit Package" : "Add Package"}</h1>
                <hr className={style.hr} />

                <form onSubmit={handleSubmit} className={style.form}>
                    <div className={style.row}>
                        <label>Place:</label>
                        <input name="place" value={place?.name} onChange={handleChange} className={style.input} readOnly />
                    </div>
                    <div className={style.row}>
                        <label>Title:</label>
                        <input name="title" value={formData.title} onChange={handleChange} className={style.input} />
                    </div>
                    <div className={style.row}>
                        <label>Description</label>
                        <input name="description" value={formData.description} onChange={handleChange} className={style.input} />
                    </div>
                    <div className={style.row}>
                        <label>Image URL</label>
                        <input name="image" value={formData.image} onChange={handleChange} className={style.input} />
                    </div>

                    <div className={style.row}>
                        <label>Duration</label>
                        <input name="duration" value={formData.duration} onChange={handleChange} className={style.input} />
                    </div>
                    <div className={style.row}>
                        <label>Price</label>
                        <input name="price" value={formData.price} onChange={handleChange} className={style.input} />
                    </div>

                    <div className={style.buttonDiv}>
                        <button type="submit" className={`${style.button} ${style.buttonGreen}`} disabled={loading}>
                            {loading
                                ? (isEditMode ? "Updating..." : "Creating...")
                                : (isEditMode ? "Update" : "Create")}
                        </button>

                        <button type="button" onClick={onClose} className={`${style.button} ${style.buttonRed}`}>
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </Popup>
    );
}