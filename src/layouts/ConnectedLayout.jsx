import { Outlet } from "react-router-dom";
import ConnectedNavbar from "../components/ConnectedNavbar";

function ConnectedLayout() {
    return (
        <div>
            <ConnectedNavbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default ConnectedLayout;