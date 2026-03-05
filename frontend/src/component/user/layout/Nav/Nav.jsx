import React, { useContext, useEffect, useState } from 'react';
import logo1 from "../../../../assets/logo1.png";
import Button from '../../components/ui/button/Button';
import { FaHome } from "react-icons/fa";
import Menu from '../../components/menu/Menu';
import Loginpage from '../../../../pages/loginpage/Loginpage';
import SignUpPage from '../../../../pages/signup/SignUpPage';
import Profile from '../../components/profile/Profile';
import { LoginContext } from '../../../../context/LoginContext'
import { useNavigate } from 'react-router-dom';

import styles from './Nav.module.css';






function Nav() {

    const navigate = useNavigate();
    const { setLogin, user, setUser, } = useContext(LoginContext);
    const [menu, setMenu] = useState(false);
    // const [login, setLogin] = useState(false);
    // const [signUp, setSignUp] = useState(false);
    // const [user, setUser] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);




    return (

        <>
            <div className={styles.navWrapper}>
                <nav className={styles.navbar}>
                    <img src={logo1} className={styles.logo} alt="companyLogo" />

                    {/* Desktop Navigation */}
                    <ul className={styles.navList}>
                        <li className={styles.navItem} onClick={() => navigate("/")}>
                            <FaHome /> Home
                        </li>

                        {!user ? (
                            <Button
                                text='Login'
                                onClick={() => setLogin(true)}
                            />
                        ) : (
                            <div className={styles.mobileControls} style={{ display: 'flex' }}>
                                <span
                                    className={styles.avatar}
                                    onClick={() => setProfileOpen(!profileOpen)}
                                >
                                    {user.name[0].toUpperCase()}
                                </span>
                            </div>
                        )}
                    </ul>

                    {/* Mobile Navigation Controls */}
                    <div className={styles.mobileControls}>
                        {user && (
                            <span
                                className={styles.avatar}
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                {user.name[0].toUpperCase()}
                            </span>
                        )}

                        <div
                            className={styles.hamburger}
                            onClick={() => setMenu(!menu)}
                        >
                            <div className={`${styles.bar} ${styles.barLong}`}></div>
                            <div className={`${styles.bar} ${styles.barShort}`}></div>
                            <div className={`${styles.bar} ${styles.barLong}`}></div>
                        </div>
                    </div>
                </nav>

                <Profile
                    user={user}
                    setUser={setUser}
                    profileOpen={profileOpen}
                    setProfileOpen={setProfileOpen}
                />
                {menu && (
                    <Menu
                        display={menu}
                        setMenu={setMenu}
                        setLogin={setLogin}
                        user={user}
                        profileOpen={profileOpen}
                        setProfileOpen={setProfileOpen}
                    />
                )}

            </div>

            <Loginpage />
            <SignUpPage />
        </>
    )
}

export default Nav