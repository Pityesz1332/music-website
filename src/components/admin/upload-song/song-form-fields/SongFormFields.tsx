import { ADMIN_UPLOAD_SONG_STRINGS } from "@i18n/ui/admin/upload-song";

interface SongFormFieldsProps {
    form: {
        title: string;
        artist: string;
        genre: string;
    };
    // partial használata, 
    // hogy csak azt a mezőt frissítsük, amelyik éppen változott
    updateForm: (values: Partial<{ title: string; artist: string; genre: string; }>) => void;
}

export const SongFormFields = ({ form, updateForm }: SongFormFieldsProps) => {
    // ez biztosítja, hogy a függvény bármilyen szöveges 
    // mezővel működjön, ami a form-ban szerepel
    const handleInputChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        updateForm({ [field]: e.target.value });
    };

    return (
        <>
            <input 
                className="upload-song__input" 
                type="text" 
                placeholder={ADMIN_UPLOAD_SONG_STRINGS.PLACEHOLDERS.TITLE} 
                value={form.title}
                onChange={handleInputChange("title")} 
            />

            <input 
                className="upload-song__input" 
                type="text" 
                placeholder={ADMIN_UPLOAD_SONG_STRINGS.PLACEHOLDERS.ARTIST} 
                value={form.artist}
                onChange={handleInputChange("artist")} 
            />
                
            <input 
                className="upload-song__input" 
                type="text" 
                placeholder={ADMIN_UPLOAD_SONG_STRINGS.PLACEHOLDERS.GENRE} 
                value={form.genre}
                onChange={handleInputChange("genre")} 
            />
        </>
    );
};