import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import ConnectedNavbar from "../components/Connected_Navbar/ConnectedNavbar";
import Playbar from "../components/Playbar/Playbar";

// eldönti, hogy a sima vagy a connected navbar-t mutatja,
// illetve a playbar-nak átadja a szükséges prop-okat
const MainLayout = () => {
    const { isConnected } = useAuth();

    return (
        <div>
            {isConnected ? <ConnectedNavbar /> : <Navbar />}
            <main>
                <Outlet />
                <Playbar />
            </main>
        </div>
    );
}

export default MainLayout;