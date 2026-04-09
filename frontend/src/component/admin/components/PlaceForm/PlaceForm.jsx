import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import Popup from "../../../user/layout/Popup/Popup";
import style from "./PlaceForm.module.css"

export default function PlaceForm({ place, onClose, onSuccess }) {

    const isEditMode = !!place;

    const [formData, setFormData] = useState({
        name: "",
        category: "international",
        image: "",
        coverImage: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (place) {
            setFormData({
                name: place.name,
                category: place.category,
                image: place.image,
                coverImage: place.coverImage
            });
        }
    }, [place]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.image || !formData.coverImage) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const url = isEditMode
                ? `http://localhost:5000/api/v1/places/${place._id}`
                : `http://localhost:5000/api/v1/places`;

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
                toast.success(`Place ${isEditMode ? 'updated' : 'added'} successfully!`);
                onSuccess();
            } else {
                toast.error(data.message || "Failed to save place");
            }

        } catch (err) {
            toast.error("Server error. Please try again.");
            console.log(err);
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
                <h1 className={style.h1}>{isEditMode ? "Edit Place" : "Add Place"}</h1>
                <hr className={style.hr} />

                <form onSubmit={handleSubmit} className={style.form}>
                    <div className={style.row}>
                        <label>Place:</label>
                        <input name="name" value={formData.name} onChange={handleChange} className={style.input} />
                    </div>

                    <div className={style.row}>
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={style.select}
                        >
                            <option value="international">International</option>
                            <option value="domestic">Domestic</option>
                        </select>
                    </div>

                    <div className={style.row}>
                        <label>Image URL</label>
                        <input name="image" value={formData.image} onChange={handleChange} className={style.input} />
                    </div>

                    <div className={style.row}>
                        <label>Cover Image</label>
                        <input name="coverImage" value={formData.coverImage} onChange={handleChange} className={style.input} />
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