import React, { useEffect, useRef } from 'react'
import Button from '../ui/button/Button'
import logo from '../../../../assets/logo.png'
import styles from './Menu.module.css'
import CloseButton from '../ui/closeButton/CloseButton';
import { useNavigate } from 'react-router-dom';


function Menu({ display,
    setMenu,
    setLogin,
    user,
    profileOpen,
    setProfileOpen
}) {

    const menuRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        function handleCLickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenu('none')
            }
        }

        document.addEventListener("mousedown", handleCLickOutside);

        return () => {
            document.removeEventListener("mousedown", handleCLickOutside);
        };
    }, []);
    return (
        <div className={`${styles.menuContainer} an-slide`}
            style={{ display: `${display}` }}>
            <div className={styles.card} ref={menuRef}>
                <CloseButton
                    onClick={() => setMenu('none')}
                />

                <img src={logo} alt="Logo" className={styles.logo} />
                <ul className={styles.menuList}>
                    <li onClick={() => { navigate("/"); setMenu('none'); }}>Home</li>
                    <li onClick={() => { navigate("/packages"); setMenu('none'); }}>Packages</li>
                    <li>About</li>
                    <li>{!user ? (
                        <Button text='Login' onClick={() => {
                            setLogin(true);
                        }} />
                    ) : (
                        <div className='flex gap-3 items-center'>
                            <span className='text-white bg-orange-500 py-1 px-3 rounded-full hover:bg-orange-200
                                hover:text-orange-500 cursor-pointer'
                                onClick={() => {
                                    (!profileOpen) ? setProfileOpen(true) : setProfileOpen(false);
                                    console.log(profileOpen)
                                }}
                            >{user.name[0].toUpperCase()}</span>
                        </div>
                    )}</li>
                </ul>
            </div>

        </div>
    )
}

export default Menu