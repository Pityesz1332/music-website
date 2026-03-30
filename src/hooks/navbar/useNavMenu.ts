import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_CONFIG } from "@constants/ui/navbar";
import { useAuth } from "@context/AuthContext";
import { useConnect } from "@hooks/auth/useConnect";
import { useDisconnect } from "@hooks/auth/useDisconnect";
import { useDeveloperMode } from "@hooks/auth/useDeveloperMode";

// kezeli a navigációt, a menüelemek szűrését és az
// autentikációs folyamatokat.
export const useNavMenu = (onClose: () => void) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isConnected } = useAuth();
    const { handleDemoConnect } = useConnect();
    const { handleDisconnect } = useDisconnect();
    const { handleDevConnect } = useDeveloperMode();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    const onConnectClick = () => {
        setIsModalOpen(true);
    }

    const confirmConnect = () => {
        handleDemoConnect();
        setIsModalOpen(false);
        onClose();
    }

    const confirmDeveloperConnect = () => {
        handleDevConnect();
        setIsModalOpen(false);
        onClose();
    }

    const onDisconnectClick = () => {
        handleDisconnect();
        onClose();
    }

    const menuItems = NAV_CONFIG.filter(
        item => !item.isProtected || (item.isProtected && isConnected)
    );

    return {
        menuItems,
        isModalOpen, setIsModalOpen,
        isConnected,
        location,
        handleNavigation,
        onConnectClick,
        confirmConnect,
        confirmDeveloperConnect,
        onDisconnectClick
    };
};