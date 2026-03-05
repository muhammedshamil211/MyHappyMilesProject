import { Link } from "react-router-dom";
import style from './AdminSideBar.module.css'

export default function AdminSidebar() {
  return (
    <div className={style.container}>
      <h2 className={style.h2}>Admin Panel</h2>

      <ul className={style.list}>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/bookings">Bookings</Link></li>
        <li><Link to="/admin/places">Places & Packages</Link></li>
      </ul>
    </div>
  );
}