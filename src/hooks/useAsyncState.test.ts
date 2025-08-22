import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAsyncState } from './useAsyncState';

describe('useAsyncState', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return correct initial values', () => {
        const { result } = renderHook(() => useAsyncState());

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should set loading state correctly', () => {
        const { result } = renderHook(() => useAsyncState());

        act(() => {
            result.current.setLoading(true);
        });

        expect(result.current.loading).toBe(true);
    });

    it('should set error state correctly', () => {
        const { result } = renderHook(() => useAsyncState());

        act(() => {
            result.current.setError('Test error message');
        });

        expect(result.current.error).toBe('Test error message');
    });

    it('should clear error state', () => {
        const { result } = renderHook(() => useAsyncState());

        // First set an error
        act(() => {
            result.current.setError('Test error');
        });
        expect(result.current.error).toBe('Test error');

        // Then clear it
        act(() => {
            result.current.clearError();
        });

        expect(result.current.error).toBe(null);
    });

    it('should execute async function successfully', async () => {
        const { result } = renderHook(() => useAsyncState());

        const mockAsyncFunction = vi.fn().mockResolvedValue('success result');

        let asyncResult: any;
        await act(async () => {
            asyncResult = await result.current.executeAsync(mockAsyncFunction);
        });

        expect(asyncResult).toBe('success result');
        expect(mockAsyncFunction).toHaveBeenCalledTimes(1);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should handle async function failure', async () => {
        const { result } = renderHook(() => useAsyncState());

        const mockAsyncFunction = vi.fn().mockRejectedValue(new Error('Async error'));

        let asyncResult: any;
        await act(async () => {
            asyncResult = await result.current.executeAsync(mockAsyncFunction);
        });

        expect(asyncResult).toBe(null);
        expect(mockAsyncFunction).toHaveBeenCalledTimes(1);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Async error');
    });

    it('should handle non-Error exceptions', async () => {
        const { result } = renderHook(() => useAsyncState());

        const mockAsyncFunction = vi.fn().mockRejectedValue('String error');

        let asyncResult: any;
        await act(async () => {
            asyncResult = await result.current.executeAsync(mockAsyncFunction);
        });

        expect(asyncResult).toBe(null);
        expect(result.current.error).toBe('Operation failed');
    });
});     