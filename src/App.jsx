import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Songs from "./pages/Songs"
import SongPage from "./pages/SongPage"

function App() {

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/songs/:id" element={<SongPage />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;