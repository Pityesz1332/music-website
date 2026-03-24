import { Search } from "lucide-react";
import { useNavbarSearch } from "@hooks/music/useNavbarSearch";
import { NAVBAR_STRINGS } from "@i18n/ui/navbar";

interface NavSearchProps {
    onActionComplete?: () => void;
}

export const NavSearch = ({ onActionComplete = () => {} }: NavSearchProps) => {
    const {
        searchTerm,
        setSearchTerm,
        isFocused,
        setIsFocused,
        executeSearch,
        handleKeyDown,
        handleBlur
    } = useNavbarSearch(onActionComplete);

    const onFocus = () => setIsFocused(true);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="navbar__search-wrapper">
            <input
                className="navbar__search-input"
                type="text"
                placeholder={NAVBAR_STRINGS.PLACEHOLDER}
                value={searchTerm}
                onFocus={onFocus}
                onBlur={handleBlur}
                onChange={onChange}
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