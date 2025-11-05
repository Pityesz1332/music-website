import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";


function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="overlay"></div>
            <div className="home-content">
                <h1>Unleash Sound Beyond Limits</h1>
                <h2>The next evolution of music - Powered by Web3</h2>
                <p>Explore, collect and stream music like never before</p>
                <button onClick={() => navigate("/songs")}>Explore Now</button>
            </div>
        </div>
    );
};

export default Home;