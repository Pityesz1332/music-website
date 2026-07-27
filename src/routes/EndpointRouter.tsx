import { lazy } from "react";
import { Routes, Route, } from "react-router-dom";
import { MainRoutes } from "./constants/MainRoutes";
import MainLayout from "@layouts/MainLayout";
import AdminLayout from "@layouts/admin-layout/AdminLayout";

import { Home } from "@pages/home/Home";
import { Songs } from "@pages/songs/Songs";
import { SongPage } from "@pages/song-page/SongPage";

import { AdminRoute } from "./AdminRoute";
import { RouteSuspense } from "./RouteSuspense";

const NotFound = lazy(() => import("@pages/not-found-fallback/NotFound").then((m) => ({ default: m.NotFound })));
const AdminDashboard = lazy(() => import("@pages/admin/admin-dashboard/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const ManageSongs = lazy(() => import("@pages/admin/manage-songs/ManageSongs").then((m) => ({ default: m.ManageSongs })));
const ManageBatches = lazy(() => import("@pages/admin/manage-batches/ManageBatches").then((m) => ({ default: m.ManageBatches })));
const AdminConnect = lazy(() => import("@pages/admin/admin-connect/AdminConnect").then((m) => ({ default: m.AdminConnect })));

export const EndpointRouter = () => {
    return (
        <Routes>
          {/* Main (Public/Connected) */}
          <Route element={<MainLayout />}>
            <Route path={MainRoutes.HOME} element={<Home />} />
            <Route path={MainRoutes.SONGS} element={<Songs />} />
            <Route path={MainRoutes.SPECIFIC_SONG} element={<SongPage />} />
          </Route>
          
          {/* Admin connect (public) */}
          <Route path={MainRoutes.ADMIN_CONNECT} element={<RouteSuspense><AdminConnect /></RouteSuspense>} />
          
          {/* Admin */}
          <Route element={<AdminLayout />}>
            <Route path={MainRoutes.ADMIN_DASHBOARD} element={<AdminRoute><RouteSuspense><AdminDashboard /></RouteSuspense></AdminRoute>} />
            <Route path={MainRoutes.ADMIN_SONGS} element={<AdminRoute><RouteSuspense><ManageSongs /></RouteSuspense></AdminRoute>} />
            <Route path={MainRoutes.ADMIN_BATCHES} element={<AdminRoute><RouteSuspense><ManageBatches /></RouteSuspense></AdminRoute>} />
          </Route>
          
          {/* Error fallback */}
          <Route path={MainRoutes.NOT_FOUND} element={<RouteSuspense><NotFound /></RouteSuspense>} />
        </Routes>
    );
}