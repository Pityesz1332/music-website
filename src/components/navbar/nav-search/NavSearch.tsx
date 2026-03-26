import { Search } from "lucide-react";
import { useNavbarSearch } from "@hooks/music/useNavbarSearch";
import { NAVBAR_STRINGS } from "@i18n/ui/navbar";

interface NavSearchProps {
    onActionComplete?: () => void;
}

export const NavSearch = ({ onActionComplete = () => {} }: NavSearchProps) => {
    const {
        searchTerm,
        isFocused,
        executeSearch,
        handleKeyDown,
        handleFocus,
        handleChange,
        handleBlur
    } = useNavbarSearch(onActionComplete);

    

    return (
        <div className="navbar__search-wrapper">
            <input
                className="navbar__search-input"
                type="text"
                placeholder={NAVBAR_STRINGS.PLACEHOLDER}
                value={searchTerm}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            {(searchTerm || isFocused) && (
                <Search 
                    className="navbar__search-icon" 
                    size={18} 
                    onClick={executeSearch} 
                />
            )}
        </div>
    );
};