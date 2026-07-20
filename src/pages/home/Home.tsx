import { MainRoutes } from "@routes/constants/MainRoutes";
import { RecentlyPlayed } from "@components/recently-played/RecentlyPlayed";
import { useBackgroundChange } from "@hooks/ui/useBackgroundChange";
import { BackgroundItem } from "./background-item/BackgroundItem";
import { Background } from "@interfaces/background";
import { HOME_STRINGS } from "@i18n/ui/home";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import "./Home.scss";

const backgrounds: Background[] = [
    { type: "image", src: "/assets/home_background1.jpg" },
    { type: "video", src: "/assets/home_video1.mp4" },
    { type: "image", src: "/assets/home_background2.jpg" },
];

export const Home = () => {
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
                <PrimaryButton className="home__button" to={MainRoutes.SONGS}>{HOME_STRINGS.BUTTONS.EXPLORE}</PrimaryButton>
                <div className="home__recent-wrapper">
                    <RecentlyPlayed />
                </div>
            </div>
        </div>
    );
};