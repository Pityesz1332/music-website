import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { MusicProvider } from "./context/MusicContext"
import { AuthProvider, useAuth } from "./context/AuthContext"

import AdminLayout from "./layouts/AdminLayout"
import UserLayout from "./layouts/UserLayout"
import ConnectedLayout from "./layouts/ConnectedLayout"

import Home from "./pages/Home"
import Songs from "./pages/Songs"
import SongPage from "./pages/SongPage"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ManageSongs from "./pages/admin/ManageSongs"
import ManageUsers from "./pages/admin/ManageUsers"

import NotFound from "./pages/NotFound"
import ErrorBoundary from "./components/ErrorBoundary"

function ProtectedRoute({ children }) {
  const { isConnected, loading } = useAuth();

  if (loading) return null;

  return isConnected ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MusicProvider>
          <Router>
            <Routes>

              {/* Public */}
              <Route element={<UserLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/songs" element={<Songs />} />
                <Route path="/songs/:id" element={<SongPage />} />
              </Route>

              {/* Connected */}
              <Route element={
                <ProtectedRoute>
                  <ConnectedLayout />
                </ProtectedRoute>
              }>
                <Route path="/connected" element={<Home />} />
                <Route path="/connected/songs" element={<Songs />} />
                <Route path="/connected/songs/:id" element={<SongPage />} />
              </Route>

              {/* Admin */}
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/songs" element={<ManageSongs />} />
                <Route path="/admin/users" element={<ManageUsers />} />
              </Route>

              {/* Error */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </MusicProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;