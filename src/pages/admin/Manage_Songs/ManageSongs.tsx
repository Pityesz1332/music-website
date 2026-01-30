import { useEffect, useState } from "react";
import { PlusCircle, Trash2, Edit, X, UploadIcon} from "lucide-react";
import songsData from "../../../data/songs.json";
import { UploadSong } from "../../../components/admin/Upload_Song/UploadSong";
import "./ManageSongs.scss";
import type { Song } from "../../../types/music";

export const ManageSongs = () => {
    const [songs, setSongs] = useState<Song[]>(() => {
        const saved = localStorage.getItem("admin_songs");
        return saved ? JSON.parse(saved) : (songsData as Song[]);
    });
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [editSong, setEditSong] = useState<Song | null>(null);
    
    useEffect(() => {
        localStorage.setItem("admin_songs", JSON.stringify(songs));
    }, [songs]);

    function saveNewSong(song: any) {
        const maxId = songs.length > 0 ? Math.max(...songs.map(s => Number(s.id))) : 0;

        const newSong: Song = {
            id: String(maxId + 1),
            title: song.title,
            artist: song.artist,
            genre: song.genre,
            duration: song.duration,
            src: song.audio,
            cover: song.coverFile,
            defaultBgVideo: "/assets/animation1.mp4",
            playingBgVideo: "/assets/waveform-to3.mp4"
        };

        setSongs([...songs, newSong]);
        setIsUploadOpen(false);
    }

    function deleteSong(id: string) {
        setSongs(songs.filter((s) => s.id !== id));
    }

    function saveEdit() {
        if (!editSong) return;
        setSongs(songs.map(s => (s.id === editSong?.id ? editSong : s)));
        setEditSong(null);
    }

    function closeModal() {
        setEditSong(null);
    }

    function handleEditChange(field: keyof Song, value: string) {
        setEditSong((prev) => prev ? { ...prev, [field]: value }: null);
    }

    return (
        <div className="manage-songs">
            <h1 className="manage-songs__title">Manage Songs</h1>

            <button className="manage-songs__add-button" onClick={() => setIsUploadOpen(true)}>
                <PlusCircle size={18} /> Add Song
            </button>

            {isUploadOpen && (
                <UploadSong
                    onCancel={() => setIsUploadOpen(false)}
                    onSave={saveNewSong}
                />
            )}

            <table className="manage-songs__table">
                <thead className="manage-songs__thead">
                    <tr className="manage-songs__row">
                        <th className="manage-songs__header">ID</th>
                        <th className="manage-songs__header">Cover</th>
                        <th className="manage-songs__header">Title</th>
                        <th className="manage-songs__header">Artist</th>
                        <th className="manage-songs__header">Genre</th>
                        <th className="manage-songs__header">Duration</th>
                        <th className="manage-songs__header">Actions</th>
                    </tr>
                </thead>
                <tbody className="manage-songs__tbody">
                    {songs.map((song) => (
                        <tr key={song.id} className="manage-songs__row">
                            <td className="manage-songs__cell" data-label="ID">{song.id}</td>
                            <td className="manage-songs__cell" data-label="Cover">
                                <img src={song.cover} alt="song cover" className="manage-songs__cover-image" />
                            </td>
                            <td className="manage-songs__cell" data-label="Title">{song.title}</td>
                            <td className="manage-songs__cell" data-label="Artist">{song.artist}</td>
                            <td className="manage-songs__cell" data-label="Genre">{song.genre}</td>
                            <td className="manage-songs__cell" data-label="Duration">{song.duration}</td>
                            <td className="manage-songs__cell manage-songs__cell--actions" data-label="Actions">
                                <button className="manage-songs__action-button manage-songs__action-button--edit" onClick={() => setEditSong(song)}>
                                    <Edit size={16} />
                                </button>
                                <button className="manage-songs__action-button manage-songs__action-button--delete" onClick={() => deleteSong(song.id)}><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editSong && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-content__header">
                            <h2 className="modal-content__title">Edit Song</h2>
                            <button className="modal-content__close-button" onClick={closeModal}><X /></button>
                        </div>
                        <div className="modal-content__body">
                            <input className="modal-content__input" type="text" placeholder="Title" value={editSong.title} onChange={(e) => handleEditChange("title", e.target.value)} />
                            <input className="modal-content__input" type="text" placeholder="Artist" value={editSong.artist} onChange={(e) => handleEditChange("artist", e.target.value)} />
                            <input className="modal-content__input" type="text" placeholder="Genre" value={editSong.genre} onChange={(e) => handleEditChange("genre", e.target.value)} />
                            
                            <label className="modal-content__label">Change Cover:</label>
                            <input className="modal-content__file-input" id="cover-upload" type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const previewURL = URL.createObjectURL(file);
                                        handleEditChange("cover", previewURL);
                                    }
                                }}
                            />

                            <label htmlFor="cover-upload" className="modal-content__upload-button">
                                <UploadIcon size={20} /> Upload Cover
                            </label>

                            {editSong.cover && (
                                <img src={editSong.cover} alt="cover preview" className="modal-content__image-preview" />
                            )}
                        </div>

                        <div className="modal-content__footer">
                            <button className="modal-content__button modal-content__button--save" onClick={saveEdit}>Save</button>
                            <button className="modal-content__button modal-content__button--cancel" onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}