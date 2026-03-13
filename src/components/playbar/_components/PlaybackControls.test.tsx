import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PlaybackControls } from './PlaybackControls';

describe('PlaybackControls', () => {
  const defaultProps = {
    onPrev: vi.fn(),
    onNext: vi.fn(),
    handlePlay: vi.fn(),
    isLoading: false,
    isPlaying: false,
  };

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: MemoryRouter });
  };

  it('renders all control buttons', () => {
    renderWithRouter(<PlaybackControls {...defaultProps} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('calls onPrev when back button is clicked', () => {
    renderWithRouter(<PlaybackControls {...defaultProps} />);
    const prevButton = screen.getAllByRole('button')[0];
    fireEvent.click(prevButton);
    expect(defaultProps.onPrev).toHaveBeenCalledTimes(1);
  });

  it('calls onNext when forward button is clicked', () => {
    renderWithRouter(<PlaybackControls {...defaultProps} />);
    const nextButton = screen.getAllByRole('button')[2];
    fireEvent.click(nextButton);
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
  });

  it('calls handlePlay when main button is clicked', () => {
    renderWithRouter(<PlaybackControls {...defaultProps} />);
    const playButton = screen.getAllByRole('button')[1];
    fireEvent.click(playButton);
    expect(defaultProps.handlePlay).toHaveBeenCalledTimes(1);
  });

  it('shows loader when isLoading is true', () => {
    const { container } = renderWithRouter(<PlaybackControls {...defaultProps} isLoading={true} />);
    const loader = container.querySelector('.playbar__loader');
    expect(loader).not.toBeNull();
  });

  it('renders Pause icon when isPlaying is true', () => {
    const { container } = renderWithRouter(<PlaybackControls {...defaultProps} isPlaying={true} />);
    const pauseIcon = container.querySelector('svg');
    expect(pauseIcon).toBeDefined();
  });

  it('renders Play icon when isPlaying is false', () => {
    const { container } = renderWithRouter(<PlaybackControls {...defaultProps} isPlaying={false} />);
    const playIcon = container.querySelector('svg');
    expect(playIcon).toBeDefined();
  });
});