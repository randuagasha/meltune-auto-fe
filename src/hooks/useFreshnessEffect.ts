'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook to automatically trigger data refetching when the browser window/tab
 * regains focus or visibility. Ensures mutations made on mobile are instantly
 * reflected on the website without requiring a manual page refresh.
 */
export function useFreshnessEffect(callback: () => void | Promise<void>, deps: any[] = []): void {
  const savedCallback = useRef(callback);
  savedCallback.current = callback;

  useEffect(() => {
    savedCallback.current();

    const onFocus = () => {
      savedCallback.current();
    };

    const onVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        savedCallback.current();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', onFocus);
      document.addEventListener('visibilitychange', onVisibilityChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', onFocus);
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
    };
  }, deps);
}
