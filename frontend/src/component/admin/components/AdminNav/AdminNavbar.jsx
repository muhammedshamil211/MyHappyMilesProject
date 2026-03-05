import style from './AdminNavbar.module.css'
import logo from '../../../../assets/logo.png'

export default function AdminNavbar() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className={style.nav}>
            <h1 className={style.h1}>Admin: {user.name}</h1>
            <img src={logo} alt="logo" className={style.img}/>
        </div>
    );
}