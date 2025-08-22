import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('usePagination', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return correct initial values', () => {
        const { result } = renderHook(() => usePagination(10));
        expect(result.current.pagination.limit).toBe(10);
        expect(result.current.pagination.offset).toBe(0);
        expect(result.current.pagination.hasNext).toBe(false);
        expect(result.current.pagination.hasPrevious).toBe(false);
    });

    it('should update pagination correctly', () => {
        const { result } = renderHook(() => usePagination(10));
        act(() => {
            result.current.updatePagination({ limit: 20, offset: 10 });
        });
        expect(result.current.pagination.limit).toBe(20);
        expect(result.current.pagination.offset).toBe(10);
    });

    it('should go to next page correctly', () => {
        const { result } = renderHook(() => usePagination(10));
        
        // First, set up pagination to have a next page
        act(() => {
            result.current.updatePagination({ 
                total: 30, 
                offset: 0, 
                hasNext: true, 
                hasPrevious: false 
            });
        });
        
        // Now load next page
        act(() => {
            result.current.loadNextPage();
        });
        
        expect(result.current.pagination.offset).toBe(10);
    });

    it('should go to previous page correctly', () => {
        const { result } = renderHook(() => usePagination(10));
        
        // First, set up pagination to have a previous page
        act(() => {
            result.current.updatePagination({ 
                total: 30, 
                offset: 10, 
                hasNext: true, 
                hasPrevious: true 
            });
        });
        
        // Now load previous page
        act(() => {
            result.current.loadPreviousPage();
        });
        
        expect(result.current.pagination.offset).toBe(0);
    });

    it('should not go to next page when hasNext is false', () => {
        const { result } = renderHook(() => usePagination(10));
        
        // Set up pagination without next page
        act(() => {
            result.current.updatePagination({ 
                total: 10, 
                offset: 0, 
                hasNext: false, 
                hasPrevious: false 
            });
        });
        
        const nextPageResult = result.current.loadNextPage();
        expect(nextPageResult).toBeNull();
        expect(result.current.pagination.offset).toBe(0);
    });

    it('should not go to previous page when hasPrevious is false', () => {
        const { result } = renderHook(() => usePagination(10));
        
        // Set up pagination without previous page
        act(() => {
            result.current.updatePagination({ 
                total: 10, 
                offset: 0, 
                hasNext: false, 
                hasPrevious: false 
            });
        });
        
        const prevPageResult = result.current.loadPreviousPage();
        expect(prevPageResult).toBeNull();
        expect(result.current.pagination.offset).toBe(0);
    });

    it('should change limit correctly', () => {
        const { result } = renderHook(() => usePagination(10));
        act(() => {
            result.current.changeLimit(20);
        });
        expect(result.current.pagination.limit).toBe(20);
        expect(result.current.pagination.offset).toBe(0);
    });

    it('should reset pagination correctly', () => {
        const { result } = renderHook(() => usePagination(10));
        
        // First set some offset
        act(() => {
            result.current.updatePagination({ offset: 20 });
        });
        expect(result.current.pagination.offset).toBe(20);
        
        // Then reset
        act(() => {
            result.current.resetPagination();
        });
        expect(result.current.pagination.offset).toBe(0);
    });

    it('should go to specific page correctly', () => {
        const { result } = renderHook(() => usePagination(10));
        
        act(() => {
            result.current.goToPage(3);
        });
        
        expect(result.current.pagination.offset).toBe(30); // page 3 * limit 10
    });

    it('should calculate current page correctly', () => {
        const { result } = renderHook(() => usePagination(10));
        expect(result.current.currentPage).toBe(1);
        
        // Change offset and check current page
        act(() => {
            result.current.updatePagination({ offset: 20 });
        });
        expect(result.current.currentPage).toBe(3); // offset 20 / limit 10 = page 3
    });

    it('should calculate total pages correctly', () => {
        const { result } = renderHook(() => usePagination(10));
        
        act(() => {
            result.current.updatePagination({ total: 25 });
        });
        expect(result.current.totalPages).toBe(3); // total 25 / limit 10 = 3 pages
    });

    it('should return correct values from loadNextPage', () => {
        const { result } = renderHook(() => usePagination(10));
        
        // Set up pagination to have a next page
        act(() => {
            result.current.updatePagination({ 
                total: 30, 
                offset: 0, 
                hasNext: true, 
                hasPrevious: false 
            });
        });
        
        const nextPageResult = result.current.loadNextPage();
        expect(nextPageResult).toEqual({ limit: 10, offset: 10 });
    });

    it('should return correct values from loadPreviousPage', () => {
        const { result } = renderHook(() => usePagination(10));
        
        // Set up pagination to have a previous page
        act(() => {
            result.current.updatePagination({ 
                total: 30, 
                offset: 20, 
                hasNext: true, 
                hasPrevious: true 
            });
        });
        
        const prevPageResult = result.current.loadPreviousPage();
        expect(prevPageResult).toEqual({ limit: 10, offset: 10 });
    });

    it('should return correct values from changeLimit', () => {
        const { result } = renderHook(() => usePagination(10));
        
        const changeLimitResult = result.current.changeLimit(20);
        expect(changeLimitResult).toEqual({ limit: 20, offset: 0 });
    });

    it('should return correct values from goToPage', () => {
        const { result } = renderHook(() => usePagination(10));
        
        const goToPageResult = result.current.goToPage(2);
        expect(goToPageResult).toEqual({ limit: 10, offset: 20 });
    });
}); 
