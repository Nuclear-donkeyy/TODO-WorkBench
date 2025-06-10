import { useState, useCallback } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface UseLoadingReturn {
  loading: LoadingState;
  isLoading: (key?: string) => boolean;
  setLoading: (key: string, value: boolean) => void;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  withLoading: <T extends any[], R>(
    key: string,
    asyncFn: (...args: T) => Promise<R>
  ) => (...args: T) => Promise<R>;
}

export const useLoading = (
  initialState: LoadingState = {}
): UseLoadingReturn => {
  const [loading, setLoadingState] = useState<LoadingState>(initialState);

  const isLoading = useCallback(
    (key?: string) => {
      if (key) {
        return loading[key] || false;
      }
      return Object.values(loading).some(Boolean);
    },
    [loading]
  );

  const setLoading = useCallback((key: string, value: boolean) => {
    setLoadingState(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const startLoading = useCallback(
    (key: string) => {
      setLoading(key, true);
    },
    [setLoading]
  );

  const stopLoading = useCallback(
    (key: string) => {
      setLoading(key, false);
    },
    [setLoading]
  );

  const withLoading = useCallback(
    <T extends any[], R>(key: string, asyncFn: (...args: T) => Promise<R>) => {
      return async (...args: T): Promise<R> => {
        try {
          startLoading(key);
          const result = await asyncFn(...args);
          return result;
        } finally {
          stopLoading(key);
        }
      };
    },
    [startLoading, stopLoading]
  );

  return {
    loading,
    isLoading,
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};

// 预定义的加载键
export const LoadingKeys = {
  SYSTEM: 'system',
  PAGE: 'page',
  SUBMIT: 'submit',
  DELETE: 'delete',
  FETCH: 'fetch',
  CHECKIN: 'checkin',
  RESET: 'reset',
} as const;

export type LoadingKey = (typeof LoadingKeys)[keyof typeof LoadingKeys];
