import React from "react";
import "../../styles/admin/AdminDashboard.css";
import songsData from "../../data/songs.json";

function AdminDashboard() {
    const totalSongs = songsData.length;
    const totalGenres = new Set(songsData.map(s => s.genre)).size;
    const totalArtists = new Set(songsData.map(s => s.artist)).size;

    return (
        <div className="admin-dashboard">
            <h1>Dashboard</h1>
            <p className="subtitle">Welcome back, Admin!</p>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Songs</h3>
                    <p className="stat-number">{totalSongs}</p>
                </div>

                <div className="stat-card">
                    <h3>Genres</h3>
                    <p className="stat-number">{totalGenres}</p>
                </div>

                <div className="stat-card">
                    <h3>Artits</h3>
                    <p className="stat-number">{totalArtists}</p>
                </div>
            </div>

            <div className="recent-seciton">
                <h2>Recent Songs</h2>

                <ul className="recent-list">
                    {songsData.slice(0, 5).map(song => (
                        <li key={song.id}>
                            <img src={song.cover} alt={song.title} />
                            <div>
                                <h4>{song.title}</h4>
                                <p>{song.artist} • {song.genre}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminDashboard;