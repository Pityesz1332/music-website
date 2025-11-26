import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { MusicProvider } from "./context/MusicContext"
import AdminLayout from "./layouts/AdminLayout"
import UserLayout from "./layouts/UserLayout"
import Home from "./pages/Home"
import Songs from "./pages/Songs"
import SongPage from "./pages/SongPage"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ManageSongs from "./pages/admin/ManageSongs"
import ManageUsers from "./pages/admin/ManageUsers"
import NotFound from "./pages/NotFound"
import ErrorBoundary from "./components/ErrorBoundary"

function App() {

  return (
    <ErrorBoundary>
      <MusicProvider>
        <Router>
          <Routes>
            <Route element={<UserLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/songs" element={<Songs />} />
              <Route path="/songs/:id" element={<SongPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/songs" element={<ManageSongs />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </MusicProvider>
    </ErrorBoundary>
  );
};

export default App;