import { useState, useCallback } from 'react';

export const useAsyncState = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setLoadingState = useCallback((isLoading: boolean) => {
        setLoading(isLoading);
    }, []);

    const setErrorState = useCallback((errorMessage: string | null) => {
        setError(errorMessage);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const executeAsync = useCallback(async <T>(
        asyncFunction: () => Promise<T>,
        errorMessage: string = 'Operation failed'
    ): Promise<T | null> => {
        setLoading(true);
        setError(null);

        try {
            const result = await asyncFunction();
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : errorMessage;
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        setLoading: setLoadingState,
        setError: setErrorState,
        clearError,
        executeAsync
    };
};
