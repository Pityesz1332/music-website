import { useNavigate } from "react-router-dom";
import { MainRoutes } from "../../routes/constants/Main_Routes";
import { RecentlyPlayed } from "../../components/Recently_Played/RecentlyPlayed";
import { useBackgroundChange } from "../../hooks/ui/useBackgroundChange";
import { BackgroundItem } from "./home_background/BackgroundItem";
import { Background } from "../../types/background";
import { HOME_STRINGS } from "../../constants/ui/home";
import "./Home.scss";

const backgrounds: Background[] = [
    { type: "image", src: "/assets/home_background1.jpg" },
    { type: "video", src: "/assets/home_video1.mp4" },
    { type: "image", src: "/assets/home_background2.jpg" },
];

export const Home = () => {
    const navigate = useNavigate();
    const { bgIndex } = useBackgroundChange(backgrounds, 5000);

    return (
        <div className="home">
            {backgrounds.map((bg, i) => (
                <BackgroundItem 
                    key={i}
                    bg={bg}
                    isActive={i === bgIndex}
                />
            ))}
            
            <div className="home__overlay"></div>
            
            <div className="home__content">
                <h1 className="home__title">{HOME_STRINGS.TITLE}</h1>
                <h2 className="home__subtitle">
                    {HOME_STRINGS.SUBTITLE.PRE_HIGHLIGHT}
                    <span className="home__highlight">{HOME_STRINGS.SUBTITLE.HIGHLIGHT}</span></h2>
                <p className="home__text">{HOME_STRINGS.DESCRIPTION}</p>
                <button className="home__button" onClick={() => navigate(MainRoutes.SONGS)}>{HOME_STRINGS.BUTTONS.EXPLORE}</button>
                <div className="home__recent-wrapper">
                    <RecentlyPlayed />
                </div>
            </div>
        </div>
    );
};