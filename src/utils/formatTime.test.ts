import { describe, it, expect } from 'vitest';
import { formatTime } from './formatTime';

describe('formatTime', () => {
  it('should return "0:00" if seconds is null or undefined', () => {
    expect(formatTime(null as any)).toBe('0:00');
    expect(formatTime(undefined as any)).toBe('0:00');
  });

  it('should return "0:00" if seconds is NaN', () => {
    expect(formatTime(NaN)).toBe('0:00');
  });

  it('should format seconds below 10 correctly', () => {
    expect(formatTime(5)).toBe('0:05');
  });

  it('should format seconds above 10 but below 60 correctly', () => {
    expect(formatTime(45)).toBe('0:45');
  });

  it('should format exact minutes correctly', () => {
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(120)).toBe('2:00');
  });

  it('should format minutes and seconds correctly', () => {
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(145)).toBe('2:25');
  });

  it('should handle large amounts of seconds', () => {
    expect(formatTime(3600)).toBe('60:00');
    expect(formatTime(3661)).toBe('61:01');
  });

  it('should floor decimal values', () => {
    expect(formatTime(65.9)).toBe('1:05');
  });
});