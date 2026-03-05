import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/AdminNav/AdminNavbar";
import AdminSidebar from "../../components/AdminSideBar/AdminSidebar";
import style from './AdminLayout.module.css'

export default function AdminLayout() {
    return (
        <div className={style.sidebar}>
            <AdminSidebar />

            <div className={style.content}>
                <AdminNavbar />

                <div className={style.outlet}>
                    <Outlet />
                </div>

            </div>
        </div>
    );
}