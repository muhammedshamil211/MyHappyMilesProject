import React, { useEffect, useState } from 'react'
import style from './Profile.module.css'
import CloseButton from '../ui/closeButton/CloseButton';
import Toast from '../toast/Toast';


function Profile({ user, setUser, profileOpen, setProfileOpen }) {


    const [tempName, setTempName] = useState(user?.name || "");
    const [email, setEmail] = useState('');
    const [toast, setToast] = useState(false);
    const [message, setMessage] = useState(null);
    const [type, setType] = useState('success');


    useEffect(() => {
        if (user) {
            setTempName(user.name)
        }
    }, [user])

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };


    // update user name 
    const updateName = async () => {

        if (!tempName.trim()) {
            setMessage("Name cannot be empty");
            setType("error");
            setToast(true);
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:5000/api/auth/edit", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: tempName })
            });

            const data = await res.json();

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);

                setMessage("Name updated successfully");
                setType("success");
            } else {
                setMessage(data.message || "Update failed");
                setType("error");
            }

        } catch (err) {
            setMessage("Server error");
            setType("error");
        }

        setToast(true);
    };

    const handleDelete = async () => {

        if (!email) {
            setMessage("Email is required to delete account");
            setType("error");
            setToast(true);
            return;
        }

        if (email !== user.email) {
            setMessage("Entered email does not match");
            setType("error");
            setToast(true);
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:5000/api/auth/edit", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (data.delete) {
                setMessage(data.message || "Account deleted");
                setType("success");
                setToast(true);

                handleLogout();
            } else {
                setMessage(data.message || "Delete failed");
                setType("error");
                setToast(true);
            }

        } catch (err) {
            setMessage("Server error");
            setType("error");
            setToast(true);
        }
    };

    return (




        <div>
            {profileOpen && user && (
                <div className={style.profileContainer}>
                    <div className={`an-slide ${style.card}`}>
                        <CloseButton onClick={() => setProfileOpen(false)} />

                        <p className={style.title}>Hello, {user.name} 👋</p>
                        <hr className={style.separator} />

                        {/* --- Update Name Section --- */}
                        <p className={style.sectionLabel}>Edit username</p>
                        <div className={style.gridRow}>
                            <input
                                type="text"
                                value={tempName}
                                className={style.inputField}
                                onChange={(e) => setTempName(e.target.value)}
                            />
                            <button className={`${style.button} ${style.blueBtn}`} onClick={() => {
                                updateName();
                                setToast(true)
                            }
                            }
                            >
                                Update
                            </button>
                        </div>

                        <hr className={style.separator} />

                        {/* --- Delete Account Section --- */}
                        <p className={style.sectionLabel}>
                            Danger Zone
                            <span className={style.deleteWarning}>Account deletion is permanent</span>
                        </p>
                        <div className={style.gridRow}>
                            <input
                                type="text"
                                className={style.inputField}
                                placeholder='Enter email to confirm'
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className={`${style.button} ${style.darkRedBtn}`} onClick={() => {
                                handleDelete();
                                setToast(true);
                            }}>
                                Delete
                            </button>
                        </div>

                        <hr className={style.separator} />

                        {/* --- Logout --- */}
                        <button
                            className={`${style.button} ${style.redBtn}`}
                            onClick={() => {
                                handleLogout();
                                setProfileOpen(false);
                                setMessage("logout successfully");
                                setType("info");
                                setToast(true);
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

            )}
            {toast && (
                <Toast
                    message={message}
                    type={type}
                    onClose={() => {
                        setToast(false);
                    }}
                />
            )}
        </div>
    )
}

export default Profile