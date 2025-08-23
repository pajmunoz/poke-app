import { useState, useCallback } from 'react';
import { calculateCurrentPage, calculateTotalPages, ensureMin } from '../utils/helpers';

export interface PaginationState {
    total: number;
    limit: number;
    offset: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export const usePagination = (initialLimit: number = 8) => {
    const [pagination, setPagination] = useState<PaginationState>({
        total: 0,
        limit: initialLimit,
        offset: 0,
        hasNext: false,
        hasPrevious: false
    });

    const updatePagination = useCallback((newPagination: Partial<PaginationState>) => {
        setPagination(prev => ({ ...prev, ...newPagination }));
    }, []);

    const goToPage = useCallback((page: number) => {
        const offset = page * pagination.limit;
        updatePagination({ offset });
        return { limit: pagination.limit, offset };
    }, [pagination.limit, updatePagination]);

    const loadNextPage = useCallback(() => {
        if (pagination.hasNext) {
            const newOffset = pagination.offset + pagination.limit;
            updatePagination({ offset: newOffset });
            return { limit: pagination.limit, offset: newOffset };
        }
        return null;
    }, [pagination, updatePagination]);

    const loadPreviousPage = useCallback(() => {
        if (pagination.hasPrevious) {
            const newOffset = ensureMin(pagination.offset - pagination.limit, 0);
            updatePagination({ offset: newOffset });
            return { limit: pagination.limit, offset: newOffset };
        }
        return null;
    }, [pagination, updatePagination]);

    const changeLimit = useCallback((newLimit: number) => {
        updatePagination({ limit: newLimit, offset: 0 });
        return { limit: newLimit, offset: 0 };
    }, [updatePagination]);

    const resetPagination = useCallback(() => {
        updatePagination({ offset: 0 });
    }, [updatePagination]);

    return {
        pagination,
        updatePagination,
        goToPage,
        loadNextPage,
        loadPreviousPage,
        changeLimit,
        resetPagination,
        currentPage: calculateCurrentPage(pagination.offset, pagination.limit),
        totalPages: calculateTotalPages(pagination.total, pagination.limit)
    };
};
