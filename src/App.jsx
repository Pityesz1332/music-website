import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import { MusicProvider } from "./context/MusicContext"
import { AuthProvider } from "./context/AuthContext"
import { NotificationProvider } from "./context/NotificationContext"
import { LoadingProvider } from "./context/LoadingContext"
import { AdminProvider } from "./context/AdminContext"

import MainLayout from "./layouts/MainLayout"
import AdminLayout from "./layouts/AdminLayout"

import Home from "./pages/Home"
import Songs from "./pages/Songs"
import SongPage from "./pages/SongPage"
import Saved from "./pages/Saved"
import MyAccount from "./pages/MyAccount"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ManageSongs from "./pages/admin/ManageSongs"
import ManageUsers from "./pages/admin/ManageUsers"
import AdminConnect from "./pages/admin/AdminConnect"
import NotFound from "./pages/NotFound"

import ErrorBoundary from "./components/ErrorBoundary"
import Notifications from "./components/Notifications"
import LoadingOverlay from "./components/LoadingOverlay"
import AdminRoute from "./components/admin/AdminRoute"

{/*function ProtectedRoute({ children }) {
  const { isConnected, loading } = useAuth();

  if (loading) return null;

  return isConnected ? children : <Navigate to="/" replace />;
}*/}

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