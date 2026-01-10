import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";

type Background = 
    | { type: "image"; src: string }
    | { type: "video"; src: string };

const backgrounds: Background[] = [
    { type: "image", src: "/assets/home_background1.jpg" },
    { type: "video", src: "/assets/home_video1.mp4" },
    { type: "image", src: "/assets/home_background2.jpg" },
];

export const Home = () => {
    const navigate = useNavigate();
    const [bgIndex, setBgIndex] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex(prev => (prev + 1) % backgrounds.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="home">
            {backgrounds.map((bg, i) => {
                const isActive = i === bgIndex;
                const bgClass = `home__background ${isActive ? "home__background--active" : ""}`

                if (bg.type === "image") {
                    return (
                        <div
                            key={i}
                            className={bgClass}
                            style={{
                                backgroundImage: `url(${bg.src})`
                            }}
                        ></div>
                    );
                } else {
                    return (
                        <video
                            key={i}
                            className={bgClass}
                            src={bg.src}
                            autoPlay muted loop
                        />
                    );
                }
            })}
            <div className="home__overlay"></div>
            <div className="home__content">
                <h1 className="home__title">Unleash Sound Beyond Limits</h1>
                <h2 className="home__subtitle">The next evolution of music - Powered by <span className="home__highlight">Web3</span></h2>
                <p className="home__text">Explore, collect and stream music like never before</p>
                <button className="home__button" onClick={() => navigate("/songs")}>Explore Now</button>
            </div>
        </div>
    );
};