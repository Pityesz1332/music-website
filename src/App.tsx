import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { MusicProvider } from "./context/MusicContext"
import { AuthProvider } from "./context/AuthContext"
import { NotificationProvider } from "./context/NotificationContext"
import { LoadingProvider } from "./context/LoadingContext"
import { AdminProvider } from "./context/AdminContext"

import MainLayout from "./layouts/MainLayout"
import AdminLayout from "./layouts/Admin_Layout/AdminLayout"

import {Home} from "./pages/Home/Home"
import {Songs} from "./pages/Songs/Songs"
import {SongPage} from "./pages/Songpage/SongPage"
import {Saved} from "./pages/Saved_Songs/Saved"
import {MyAccount} from "./pages/Profile/MyAccount"
import {AdminDashboard} from "./pages/admin/Admin_Dashboard/AdminDashboard"
import {ManageSongs} from "./pages/admin/Manage_Songs/ManageSongs"
import {ManageUsers} from "./pages/admin/Manage_Users/ManageUsers"
import {AdminConnect} from "./pages/admin/Admin_Connect/AdminConnect"
import {NotFound} from "./pages/Not_found_fallback/NotFound"

import ErrorBoundary from "./components/Error_Boundary/ErrorBoundary"
import Notifications from "./components/Notifications/Notifications"
import LoadingOverlay from "./components/Loading_Overlay/LoadingOverlay"

import { AdminRoute } from "./routes/AdminRoute"

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <LoadingProvider>
          <AuthProvider>
            <AdminProvider>
              <MusicProvider>
                <Notifications />
                <LoadingOverlay />
                <Router>
                  <Routes>

                    {/* Main (Public/Connected) */}
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/songs" element={<Songs />} />
                      <Route path="/songs/:id" element={<SongPage />} />
                      <Route path="/saved" element={<Saved />} />
                      <Route path="/myaccount" element={<MyAccount />} />
                    </Route>
                    
                    {/* Admin connect (public) */}
                    <Route path="/admin/connect" element={<AdminConnect />} />

                    {/* Admin */}
                    <Route element={<AdminLayout />}>
                      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                      <Route path="/admin/songs" element={<AdminRoute><ManageSongs /></AdminRoute>} />
                      <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
                    </Route>
                    
                    {/* Error fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Router>
              </MusicProvider>
            </AdminProvider>
          </AuthProvider>
        </LoadingProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;