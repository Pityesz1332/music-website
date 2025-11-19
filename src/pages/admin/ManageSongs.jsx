import React, { useState } from "react";
import { PlusCircle, Trash2, Edit, X } from "lucide-react";
import songsData from "../../data/songs.json";
import "../../styles/ManageSongs.css";

function ManageSongs() {
    const [songs, setSongs] = useState(songsData);
    const [isUploadMode, setIsUploadMode] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [newSong, setNewSong] = useState({
        title: "",
        artist: "",
        genre: "",
        cover: "",
        audio: "",
        duration: "",
        description: ""
    });
    
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editSong, setEditSong] = useState(null);
    
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        setUploadedFile(file);
        setNewSong({
            ...newSong,
            audio: URL.createObjectURL(file),
            title: file.name.replace(/\.[^/.]+$/, "")
        });
        setIsUploadMode(true);
    }

    function handleAddSong() {
        if (!newSong.title || !newSong.artist || !newSong.genre) {
            alert("Add title, artist and genre!");
            return;
        }

        const newId = songs.length + 1;
        const addedSong = {
            id: newId,
            ...newSong,
            cover: newSong.cover || "/dummy-data/dummy1.jpg",
            audio: newSong.audio || "/dummy-data/audio1.mp3",
            duration: newSong.duration || "3:45",
            description: newSong.description || "Newly added song."
        };

        setSongs([...songs, addedSong]);
        setNewSong({
            title: "",
            artist: "",
            genre: "",
            cover: "",
            audio: "",
            duration: "",
            description: ""
        });
        setUploadedFile(null);
        setIsUploadMode(false);
    }

    function handleDeleteSong(id) {
        setSongs(songs.filter((song) => song.id !== id));
    };

    function openEditModal(song) {
        setEditSong(song);
        setIsEditOpen(true);
    }

    function handleEditChange(field, value) {
        setEditSong({ ...editSong, [field]: value });
    }

    function saveEdit() {
        setSongs(songs.map((s) => (s.id === editSong.id ? editSong : s)));
        setIsEditOpen(false);
        setEditSong(null);
    }

    function closeModal() {
        setIsEditOpen(false);
        setEditSong(null);
    }

    return (
        <div className="manage-songs">
            <h1>Manage Songs</h1>

            {!isUploadMode && (
                <div className="upload-btn-container">
                    <label className="upload-btn">
                        <PlusCircle size={18} /> Upload
                        <input type="file" accept="audio/*" onChange={handleFileUpload} hidden />
                    </label>
                </div>
            )}

            {isUploadMode && (
                <div className="add-song-form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newSong.title}
                        onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Artist"
                        value={newSong.artist}
                        onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Genre"
                        value={newSong.genre}
                        onChange={(e) => setNewSong({ ...newSong, genre: e.target.value })}
                    />
                    <textarea 
                        placeholder="Description"
                        value={newSong.description}
                        onChange={(e) => setNewSong({ ...newSong, description: e.target.value })}
                    />
                    <button onClick={handleAddSong}>
                        <PlusCircle size={18} /> Add Song
                    </button>
                    <button
                        onClick={() => {
                            setIsUploadMode(false);
                            setUploadedFile(null);
                        }}
                        className="cancel-upload-btn"
                    >
                        Cancel
                    </button>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cover</th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Genre</th>
                        <th>Duration</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song) => (
                        <tr key={song.id}>
                            <td>{song.id}</td>
                            <td>
                                <img 
                                    src={song.cover}
                                    alt={song.title}
                                    className="song-cover"
                                />
                            </td>
                            <td>{song.title}</td>
                            <td>{song.artist}</td>
                            <td>{song.genre}</td>
                            <td>{song.duration}</td>
                            <td className="actions">
                                <button className="edit-btn" onClick={() => openEditModal(song)}>
                                    <Edit size={16} />
                                </button>
                                <button className="delete-btn" onClick={() => handleDeleteSong(song.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isEditOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Edit Song</h2>
                            <button onClick={closeModal}><X /></button>
                        </div>
                        <div className="modal-body">
                            <input type="text" placeholder="Title" value={editSong.title} onChange={(e) => handleEditChange("title", e.target.value)} />
                            <input type="text" placeholder="Artist" value={editSong.artist} onChange={(e) => handleEditChange("artist", e.target.value)} />
                            <input type="text" placeholder="Genre" value={editSong.genre} onChange={(e) => handleEditChange("genre", e.target.value)} />
                            <input type="text" placeholder="Cover" value={editSong.cover} onChange={(e) => handleEditChange("cover", e.target.value)} />
                            <input type="text" placeholder="Audio" value={editSong.audio} onChange={(e) => handleEditChange("audio", e.target.value)} />
                            <input type="text" placeholder="Duration" value={editSong.duration} onChange={(e) => handleEditChange("duration", e.target.value)} />
                            <textarea placeholder="Description" value={editSong.description} onChange={(e) => handleEditChange("description", e.target.value)} />
                        </div>
                        <div className="modal-footer">
                            <button onClick={saveEdit}>Save</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageSongs;