import React, { useState } from "react";
import { PlusCircle, Trash2, Edit, X, UploadIcon} from "lucide-react";
import songsData from "../../data/songs.json";
import UploadSong from "../../components/admin/UploadSong";
import "../../styles/admin/ManageSongs.css";

function ManageSongs() {
    const [songs, setSongs] = useState(songsData);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [editSong, setEditSong] = useState(null);
    
    function saveNewSong(song) {
        const newId = songs.length + 1;
        setSongs([...songs, { id: newId, ...song }]);
        setIsUploadOpen(false);
    }

    function deleteSong(id) {
        setSongs(songs.filter((s) => s.id !== id));
    }

    function saveEdit() {
        setSongs(songs.map(s => (s.id === editSong.id ? editSong : s)));
        setEditSong(null);
    }

    function closeModal() {
        setEditSong(null);
    }

    function handleEditChange(field, value) {
        setEditSong((prev) => ({ ...prev, [field]: value }));
    }

    return (
        <div className="manage-songs">
            <h1>Manage Songs</h1>

            <button className="upload-btn" onClick={() => setIsUploadOpen(true)}>
                <PlusCircle size={18} /> Add Song
            </button>

            {isUploadOpen && (
                <UploadSong
                    onCancel={() => setIsUploadOpen(false)}
                    onSave={saveNewSong}
                />
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
                            <td><img src={song.cover} alt="song cover" className="song-cover" /></td>
                            <td>{song.title}</td>
                            <td>{song.artist}</td>
                            <td>{song.genre}</td>
                            <td>{song.duration}</td>
                            <td className="manage-actions">
                                <button onClick={() => setEditSong(song)}><Edit size={16} /></button>
                                <button onClick={() => deleteSong(song.id)}><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editSong && ( 
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
                            <label className="cover-label">Change Cover:</label>
                            <input id="cover-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const previewURL = URL.createObjectURL(file);
                                        handleEditChange("cover", previewURL);
                                    }
                                }}
                            />

                            <label htmlFor="cover-upload" className="custom-upload-btn">
                                <UploadIcon size={20} /> Upload Cover
                            </label>

                            {editSong.cover && (
                                <img src={editSong.cover} alt="cover preview" className="edit-cover-preview" />
                            )}
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