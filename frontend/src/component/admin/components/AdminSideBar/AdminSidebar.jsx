import { NavLink, useNavigate } from "react-router-dom";
import style from './AdminSidebar.module.css'
import { useContext } from "react";
import { LoginContext } from "../../../../context/LoginContext";

export default function AdminSidebar({ closeSidebar }) {
  const { logout } = useContext(LoginContext);
  const navigate = useNavigate();

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

      <button
        className={style.logoutBtn}
        onClick={async () => {
          await logout();
          closeSidebar?.();
          navigate('/');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>
  );
}