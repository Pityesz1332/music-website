import { SONGS_STRINGS } from "@i18n/ui/songs";

// egyszerű footer komponens, 
// ami jelenleg csak a songs oldalon elérhető
export const SongsFooter = () => {
    return (
        <footer className="songs__footer">
            <p>© {new Date().getFullYear()} DJ Enez - {SONGS_STRINGS.FOOTER.RIGHTS}</p>
            
            <a 
                href="https://soundcloud.com/djenez"
                target="_blank"
                rel="noopener noreferrer"
                className="songs__soundcloud-link"
            >
                <img className="songs__soundcloud-logo" src="/assets/soundcloud-logo.svg" alt="SoundCloud" />
                <span>{SONGS_STRINGS.FOOTER.FOLLOW} 
                    <strong className="songs__brand-name">
                        <span>DJ Enez</span>
                    </strong> {SONGS_STRINGS.FOOTER.ON_SOUNDCLOUD}</span>
            </a>
        </footer>
    );
}