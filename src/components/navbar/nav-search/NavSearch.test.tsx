import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavSearch } from './NavSearch';
import { useNavbarSearch } from '../../../../hooks/music/useNavbarSearch';

vi.mock('../../../hooks/music/useNavbarSearch');
vi.mock('../../../constant-strings/ui/navbar', () => ({
    NAVBAR_STRINGS: {
        PLACEHOLDER: 'Search songs...'
    }
}));

describe('NavSearch Component', () => {
    const mockSetSearchTerm = vi.fn();
    const mockSetIsFocused = vi.fn();
    const mockExecuteSearch = vi.fn();
    const mockHandleKeyDown = vi.fn();
    const mockHandleBlur = vi.fn();
    const mockOnActionComplete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavbarSearch as any).mockReturnValue({
            searchTerm: '',
            setSearchTerm: mockSetSearchTerm,
            isFocused: false,
            setIsFocused: mockSetIsFocused,
            executeSearch: mockExecuteSearch,
            handleKeyDown: mockHandleKeyDown,
            handleBlur: mockHandleBlur
        });
    });

    it('should render the input with correct placeholder', () => {
        render(<NavSearch onActionComplete={mockOnActionComplete} />);
        
        expect(screen.getByPlaceholderText('Search songs...')).toBeInTheDocument();
    });

    it('should update search term on change', () => {
        render(<NavSearch />);
        const input = screen.getByPlaceholderText('Search songs...');
        
        fireEvent.change(input, { target: { value: 'In Flames' } });
        
        expect(mockSetSearchTerm).toHaveBeenCalledWith('In Flames');
    });

    it('should trigger focus state on input focus', () => {
        render(<NavSearch />);
        const input = screen.getByPlaceholderText('Search songs...');
        
        fireEvent.focus(input);
        
        expect(mockSetIsFocused).toHaveBeenCalledWith(true);
    });

    it('should call handleBlur when input loses focus', () => {
        render(<NavSearch />);
        const input = screen.getByPlaceholderText('Search songs...');
        
        fireEvent.blur(input);
        
        expect(mockHandleBlur).toHaveBeenCalled();
    });

    it('should call handleKeyDown when a key is pressed', () => {
        render(<NavSearch />);
        const input = screen.getByPlaceholderText('Search songs...');
        
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        
        expect(mockHandleKeyDown).toHaveBeenCalled();
    });

    it('should not show search icon when searchTerm is empty and not focused', () => {
        const { container } = render(<NavSearch />);
        const icon = container.querySelector('.navbar__search-icon');
        
        expect(icon).not.toBeInTheDocument();
    });

    it('should show search icon when focused even if searchTerm is empty', () => {
        (useNavbarSearch as any).mockReturnValue({
            searchTerm: '',
            setSearchTerm: mockSetSearchTerm,
            isFocused: true,
            setIsFocused: mockSetIsFocused,
            executeSearch: mockExecuteSearch,
            handleKeyDown: mockHandleKeyDown,
            handleBlur: mockHandleBlur
        });

        const { container } = render(<NavSearch />);
        const icon = container.querySelector('.navbar__search-icon');
        
        expect(icon).toBeInTheDocument();
    });

    it('should call executeSearch when search icon is clicked', () => {
        (useNavbarSearch as any).mockReturnValue({
            searchTerm: 'test',
            setSearchTerm: mockSetSearchTerm,
            isFocused: false,
            setIsFocused: mockSetIsFocused,
            executeSearch: mockExecuteSearch,
            handleKeyDown: mockHandleKeyDown,
            handleBlur: mockHandleBlur
        });

        const { container } = render(<NavSearch />);
        const icon = container.querySelector('.navbar__search-icon');
        
        if (icon) fireEvent.click(icon);
        
        expect(mockExecuteSearch).toHaveBeenCalled();
    });
});