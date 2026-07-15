import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClipboard } from '../user-account/useClipboard';
import { useNotification } from "../../context/NotificationContext";

vi.mock("../../context/NotificationContext", () => ({
  useNotification: vi.fn(),
  NotificationType: {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
  }
}));

describe('useClipboard', () => {
  const mockNotify = vi.fn();
  const mockWriteText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(useNotification).mockReturnValue({
      notify: mockNotify,
      notifications: []
    });

    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });

  it('should copy text to clipboard and call notify with default message', async () => {
    const { result } = renderHook(() => useClipboard());
    const testText = '0x123abc';

    await act(async () => {
      result.current.copyToClipboard(testText);
    });

    expect(mockWriteText).toHaveBeenCalledWith(testText);
    expect(mockNotify).toHaveBeenCalledWith('Copied to clipboard', 'SUCCESS');
  });

  it('should copy text to clipboard and call notify with custom message', async () => {
    const { result } = renderHook(() => useClipboard());
    const testText = '0x123abc';
    const customMessage = 'Wallet address saved';

    await act(async () => {
      result.current.copyToClipboard(testText, customMessage);
    });

    expect(mockWriteText).toHaveBeenCalledWith(testText);
    expect(mockNotify).toHaveBeenCalledWith(customMessage, 'SUCCESS');
  });
});