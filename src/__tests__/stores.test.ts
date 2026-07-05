import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTripStore, useChecklistStore, usePhotosStore } from '../stores';

describe('Trip Store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with 7 days', () => {
    const { result } = renderHook(() => useTripStore());
    expect(result.current.days).toHaveLength(7);
  });

  it('should toggle activity completion', () => {
    const { result } = renderHook(() => useTripStore());
    
    act(() => {
      result.current.toggleActivity(1, '1-1');
    });

    const day1 = result.current.days.find((d) => d.id === 1);
    const activity = day1?.activities.find((a) => a.id === '1-1');
    expect(activity?.completed).toBe(true);
  });

  it('should calculate total progress', () => {
    const { result } = renderHook(() => useTripStore());
    
    act(() => {
      result.current.toggleActivity(1, '1-1');
      result.current.toggleActivity(1, '1-2');
    });

    const progress = result.current.getTotalProgress();
    expect(progress).toBeGreaterThan(0);
  });
});

describe('Checklist Store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with items', () => {
    const { result } = renderHook(() => useChecklistStore());
    expect(result.current.items.length).toBeGreaterThan(0);
  });

  it('should toggle item packed status', () => {
    const { result } = renderHook(() => useChecklistStore());
    const firstItem = result.current.items[0];
    
    act(() => {
      result.current.toggleItem(firstItem.id);
    });

    const updatedItem = result.current.items.find((i) => i.id === firstItem.id);
    expect(updatedItem?.packed).toBe(true);
  });

  it('should calculate progress', () => {
    const { result } = renderHook(() => useChecklistStore());
    
    act(() => {
      result.current.items.slice(0, 3).forEach((item) => {
        result.current.toggleItem(item.id);
      });
    });

    const progress = result.current.getProgress();
    expect(progress).toBeGreaterThan(0);
  });
});

describe('Photos Store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with empty photos', () => {
    const { result } = renderHook(() => usePhotosStore());
    expect(result.current.photos).toHaveLength(0);
  });

  it('should add photo', () => {
    const { result } = renderHook(() => usePhotosStore());
    
    act(() => {
      result.current.addPhoto({
        id: '1',
        name: 'test.jpg',
        thumb: 'thumb',
        full: 'full',
        status: 'uploaded',
        eventId: 'bulgaria-2026',
        timestamp: new Date().toISOString(),
      });
    });

    expect(result.current.photos).toHaveLength(1);
  });

  it('should remove photo', () => {
    const { result } = renderHook(() => usePhotosStore());
    
    act(() => {
      result.current.addPhoto({
        id: '1',
        name: 'test.jpg',
        thumb: 'thumb',
        full: 'full',
        status: 'uploaded',
        eventId: 'bulgaria-2026',
        timestamp: new Date().toISOString(),
      });
    });

    act(() => {
      result.current.removePhoto('1');
    });

    expect(result.current.photos).toHaveLength(0);
  });
});