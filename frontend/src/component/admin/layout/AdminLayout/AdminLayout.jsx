import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/AdminNav/AdminNavbar";
import AdminSidebar from "../../components/AdminSideBar/AdminSidebar";
import style from './AdminLayout.module.css'

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={style.layoutContainer}>
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div 
                    className={style.overlay} 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className={`${style.sidebarWrapper} ${isSidebarOpen ? style.open : ''}`}>
                <AdminSidebar closeSidebar={() => setIsSidebarOpen(false)} />
            </div>

            <div className={style.content}>
                <AdminNavbar toggleSidebar={toggleSidebar} />

                <div className={style.outlet}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}