import style from './AdminNavbar.module.css'
import logo from '../../../../assets/logo.png'

export default function AdminNavbar({ toggleSidebar }) {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className={style.nav}>
            <div className={style.leftSection}>
                <button className={style.hamburger} onClick={toggleSidebar}>
                    <div className={style.bar}></div>
                    <div className={style.bar}></div>
                    <div className={style.bar}></div>
                </button>
                <h1 className={style.h1}>Admin: {user.name}</h1>
            </div>
            <img src={logo} alt="logo" className={style.img} />
        </div>
    );
}