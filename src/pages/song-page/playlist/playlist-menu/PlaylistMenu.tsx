import { Pencil, Trash2 } from "lucide-react";
import { PrimaryButton } from "@components/ui/button/PrimaryButton";
import { SONG_PAGE_STRINGS } from "@i18n/ui/song-page";
import "./PlaylistMenu.scss";

interface PlaylistMenuProps {
    contextMenu: { x: number; y: number; songId: string } | null;
    menuRef: React.RefObject<HTMLDivElement | null>;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

// egy menü, amely pontosan ott jelenik meg, ahol a user
// jobb klikkel kattintott.
// felülbírálja a böngésző default jobbklikkmenüjét
export const PlaylistMenu = ({ contextMenu, menuRef, onEdit, onDelete }: PlaylistMenuProps) => {
    if (!contextMenu) return null;

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(contextMenu.songId);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(contextMenu.songId);
    };

    return (
        <div
            className="song-page__context-menu"
            ref={menuRef}
            style={{ top: contextMenu.y, left: contextMenu.x }}
        >
            <PrimaryButton onClick={handleEditClick} className="menu-item edit">
                <Pencil size={16} />
                <span>{SONG_PAGE_STRINGS.CONTEXT_MENU.EDIT}</span>
            </PrimaryButton>
            <div className="menu-divider"></div>
            <PrimaryButton onClick={handleDeleteClick}
                className="menu-item delete"
            >
                <Trash2 size={16} />
                <span>{SONG_PAGE_STRINGS.CONTEXT_MENU.DELETE}</span>
            </PrimaryButton>
        </div>
    );
};