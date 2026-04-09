import { NavLink } from "react-router-dom";
import style from './AdminSideBar.module.css'

export default function AdminSidebar({ closeSidebar }) {
  return (
    <div className={style.container}>
      <div className={style.header}>
          <h2 className={style.h2}>Admin Panel</h2>
          <button className={style.closeBtn} onClick={closeSidebar}>×</button>
      </div>

      <ul className={style.list}>
        <li><NavLink to="/admin" end className={({ isActive }) => isActive ? style.activeLink : style.link} onClick={closeSidebar}>Dashboard</NavLink></li>
        <li><NavLink to="/admin/users" className={({ isActive }) => isActive ? style.activeLink : style.link} onClick={closeSidebar}>Users</NavLink></li>
        <li><NavLink to="/admin/bookings" className={({ isActive }) => isActive ? style.activeLink : style.link} onClick={closeSidebar}>Bookings</NavLink></li>
        <li><NavLink to="/admin/places" className={({ isActive }) => isActive ? style.activeLink : style.link} onClick={closeSidebar}>Places & Packages</NavLink></li>
        <li><NavLink to="/admin/reviews" className={({ isActive }) => isActive ? style.activeLink : style.link} onClick={closeSidebar}>Reviews</NavLink></li>
        <li><NavLink to="/admin/package-analytics" className={({ isActive }) => isActive ? style.activeLink : style.link} onClick={closeSidebar}>Analytics</NavLink></li>
      </ul>
    </div>
  );
}