import "./AdminDashboard.scss";
import songsData from "../../../data/songs.json";
import type { Song } from "../../../types/music";

// típuskényszerítés
const songs = songsData as Song[];

export const AdminDashboard = () => {
    const totalSongs = songsData.length;
    const totalGenres = new Set(songsData.map(s => s.genre)).size;
    const totalArtists = new Set(songsData.map(s => s.artist)).size;

    return (
        <div className="admin-dashboard">
            <h1 className="admin-dashboard__title">Dashboard</h1>
            <p className="admin-dashboard__subtitle">Welcome back, Admin!</p>

            <div className="admin-dashboard__stats">
                <div className="stat-card">
                    <h3 className="stat-card__label">Total Songs</h3>
                    <p className="stat-card__value">{totalSongs}</p>
                </div>

                <div className="stat-card">
                    <h3 className="stat-card__label">Genres</h3>
                    <p className="stat-card__value">{totalGenres}</p>
                </div>

                <div className="stat-card">
                    <h3 className="stat-card__label">Artists</h3>
                    <p className="stat-card__value">{totalArtists}</p>
                </div>
            </div>

            <div className="admin-dashboard__section">
                <h2 className="admin-dashboard__section-title">Recent Songs</h2>

                <ul className="song-list">
                    {songsData.slice(0, 5).map(song => (
                        <li key={song.id} className="song-list__item">
                            <img className="song-list__cover" src={song.cover} alt={song.title} />
                            <div className="song-list__info">
                                <h4 className="song-list__song-title">{song.title}</h4>
                                <p className="song-list__details">{song.artist} • {song.genre}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}