import { Routes, Route, } from "react-router-dom";
import { MainRoutes } from "./constants/Main_Routes";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/Admin_Layout/AdminLayout";

import {Home} from "../pages/Home/Home";
import {Songs} from "../pages/Songs/Songs";
import {SongPage} from "../pages/Songpage/SongPage";
import {Saved} from "../pages/Saved_Songs/Saved";
import {MyAccount} from "../pages/Profile/MyAccount";
import {AdminDashboard} from "../pages/admin/Admin_Dashboard/AdminDashboard";
import {ManageSongs} from "../pages/admin/Manage_Songs/ManageSongs";
import {ManageUsers} from "../pages/admin/Manage_Users/ManageUsers";
import {AdminConnect} from "../pages/admin/Admin_Connect/AdminConnect";
import {NotFound} from "../pages/Not_found_fallback/NotFound";

import { AdminRoute } from "../routes/AdminRoute";

export const EndpointRouter = () => {
    return (
        <Routes>
          {/* Main (Public/Connected) */}
          <Route element={<MainLayout />}>
            <Route path={MainRoutes.HOME} element={<Home />} />
            <Route path={MainRoutes.SONGS} element={<Songs />} />
            <Route path={MainRoutes.SPECIFIC_SONG} element={<SongPage />} />
            <Route path={MainRoutes.SAVED} element={<Saved />} />
            <Route path={MainRoutes.MY_ACCOUNT} element={<MyAccount />} />
          </Route>
          
          {/* Admin connect (public) */}
          <Route path={MainRoutes.ADMIN_CONNECT} element={<AdminConnect />} />
          
          {/* Admin */}
          <Route element={<AdminLayout />}>
            <Route path={MainRoutes.ADMIN_DASHBOARD} element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path={MainRoutes.ADMIN_SONGS} element={<AdminRoute><ManageSongs /></AdminRoute>} />
            <Route path={MainRoutes.ADMIN_USERS} element={<AdminRoute><ManageUsers /></AdminRoute>} />
          </Route>
          
          {/* Error fallback */}
          <Route path={MainRoutes.NOT_FOUND} element={<NotFound />} />
        </Routes>
    );
}