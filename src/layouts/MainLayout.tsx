import { Outlet } from "react-router-dom";
import Navbar from "@components/navbar/Navbar";
import Playbar from "@components/playbar/Playbar";

// Defines the visual structure of the layout.
const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
                <Playbar />
            </main>
        </div>
    );
}

export default MainLayout;