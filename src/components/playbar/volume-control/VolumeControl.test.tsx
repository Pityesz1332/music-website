import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { VolumeControl } from './VolumeControl';

describe('VolumeControl', () => {
    const defaultProps = {
        volume: 0.5,
        volumeWrapperRef: { current: null } as React.RefObject<HTMLDivElement | null>,
        handleVolumeDragStart: vi.fn(),
        handleVolumeChanger: vi.fn(),
        adjustVolume: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with correct styles based on volume', () => {
        render(<VolumeControl {...defaultProps} />);
        
        const fill = document.querySelector('.playbar__volume-fill');
        const thumb = document.querySelector('.playbar__volume-thumb');
        const input = screen.getByRole('slider');

        expect(fill).toHaveStyle('width: 50%');
        expect(thumb).toHaveStyle('left: 50%');
        expect(input).toHaveValue('0.5');
    });

    it('calls handleVolumeChanger when input value changes', () => {
        render(<VolumeControl {...defaultProps} />);
        
        const input = screen.getByRole('slider');
        fireEvent.change(input, { target: { value: '0.8' } });

        expect(defaultProps.handleVolumeChanger).toHaveBeenCalled();
    });

    it('calls handleVolumeDragStart on mouse down', () => {
        const { container } = render(<VolumeControl {...defaultProps} />);
        
        const wrapper = container.firstChild as HTMLElement;
        fireEvent.mouseDown(wrapper);

        expect(defaultProps.handleVolumeDragStart).toHaveBeenCalled();
    });

    it('calls adjustVolume with correct direction on wheel event', () => {
        render(<VolumeControl {...defaultProps} />);
        
        const wrapper = document.querySelector('.playbar__volume-wrapper')!;

        fireEvent.wheel(wrapper, { deltaY: 100 });
        expect(defaultProps.adjustVolume).toHaveBeenCalledWith(1);

        fireEvent.wheel(wrapper, { deltaY: -100 });
        expect(defaultProps.adjustVolume).toHaveBeenCalledWith(-1);
    });

    it('does not call adjustVolume if deltaY is 0', () => {
        render(<VolumeControl {...defaultProps} />);
        
        const wrapper = document.querySelector('.playbar__volume-wrapper')!;
        fireEvent.wheel(wrapper, { deltaY: 0 });

        expect(defaultProps.adjustVolume).not.toHaveBeenCalled();
    });
});