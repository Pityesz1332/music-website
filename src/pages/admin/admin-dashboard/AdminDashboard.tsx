import songsData from "../../../data/songs.json";
import type { Song } from "../../../types/music";
import { ADMIN_DASHBOARD_STRINGS } from "../../../i18n/ui/admin/dashboard";
import "./AdminDashboard.scss";

// típuskényszerítés
const songs = songsData as Song[];

export const AdminDashboard = () => {
    const totalSongs = songsData.length;
    const totalGenres = new Set(songsData.map(s => s.genre)).size;
    const totalArtists = new Set(songsData.map(s => s.artist)).size;

    return (
        <div className="admin-dashboard">
            <h1 className="admin-dashboard__title">{ADMIN_DASHBOARD_STRINGS.TITLE}</h1>
            <p className="admin-dashboard__subtitle">{ADMIN_DASHBOARD_STRINGS.GREETING}</p>

            <div className="admin-dashboard__stats">
                <div className="stat-card">
                    <h3 className="stat-card__label">{ADMIN_DASHBOARD_STRINGS.STATS.TOTAL_SONGS}</h3>
                    <p className="stat-card__value">{totalSongs}</p>
                </div>

                <div className="stat-card">
                    <h3 className="stat-card__label">{ADMIN_DASHBOARD_STRINGS.STATS.GENRES}</h3>
                    <p className="stat-card__value">{totalGenres}</p>
                </div>

                <div className="stat-card">
                    <h3 className="stat-card__label">{ADMIN_DASHBOARD_STRINGS.STATS.ARTISTS}</h3>
                    <p className="stat-card__value">{totalArtists}</p>
                </div>
            </div>

            <div className="admin-dashboard__section">
                <h2 className="admin-dashboard__section-title">{ADMIN_DASHBOARD_STRINGS.RECENT_SONGS}</h2>

                <div className="song-list">
                    {songsData.slice(0, 5).map(song => (
                        <div key={song.id} className="song-list__item">
                            <img className="song-list__cover" src={song.cover} alt={song.title} />
                            <div className="song-list__info">
                                <h4 className="song-list__song-title">{song.title}</h4>
                                <p className="song-list__details">{song.artist} • {song.genre}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}