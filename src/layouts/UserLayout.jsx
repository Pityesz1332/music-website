import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; 

function UserLayout() {
    return (
        <div className="user-layout">
            <Navbar />

            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default UserLayout;