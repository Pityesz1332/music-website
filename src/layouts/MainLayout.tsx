import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Playbar from "../components/Playbar/Playbar";

// a playbar-nak átadja a szükséges prop-okat
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