import React, { useState, useEffect } from "react";
import "../styles/pages/Home.css";
import { useNavigate } from "react-router-dom";

const backgrounds = [
    { type: "image", src: "/assets/home_background1.jpg" },
    { type: "video", src: "/assets/home_video1.mp4" },
    { type: "image", src: "/assets/home_background2.jpg" },
];

function Home() {
    const navigate = useNavigate();
    const [bgIndex, setBgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex(prev => (prev + 1) % backgrounds.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="home-container">
            {backgrounds.map((bg, i) => {
                const isActive = i === bgIndex;
                if (bg.type === "image") {
                    return (
                        <div
                            key={i}
                            className="background-layer"
                            style={{
                                backgroundImage: `url(${bg.src})`,
                                opacity: isActive ? 1 : 0,
                                transition: "opacity 1s ease"
                            }}
                        ></div>
                    );
                } else if (bg.type === "video") {
                    return (
                        <video
                            key={i}
                            className="background-layer"
                            src={bg.src}
                            autoPlay
                            muted
                            loop
                            style={{
                                opacity: isActive ? 1 : 0,
                                transition: "opacity 1s ease",
                                objectFit: "cover"
                            }}
                        />
                    );
                }
            })}
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