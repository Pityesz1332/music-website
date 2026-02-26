import { Routes, Route, } from "react-router-dom";
import { MainRoutes } from "./constants/MainRoutes";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/admin-layout/AdminLayout";

import {Home} from "../pages/home/Home";
import {Songs} from "../pages/songs/Songs";
import {SongPage} from "../pages/songpage/SongPage";
import {Saved} from "../pages/saved-songs/Saved";
import {MyAccount} from "../pages/profile/MyAccount";
import {AdminDashboard} from "../pages/admin/admin-dashboard/AdminDashboard";
import {ManageSongs} from "../pages/admin/manage-songs/ManageSongs";
import {ManageUsers} from "../pages/admin/manage-users/ManageUsers";
import {AdminConnect} from "../pages/admin/admin-connect/AdminConnect";
import {NotFound} from "../pages/not-found-fallback/NotFound";

import { AdminRoute } from "./AdminRoute";

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