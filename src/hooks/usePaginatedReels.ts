import { useEffect } from 'react';
import { useReelsStore } from '../store/reelsStore';

export function usePaginatedReels() {
  const { items, loadNextPage, isLoading, total, error } = useReelsStore();

  useEffect(() => {
    if (items.length === 0 && !isLoading) {
      void loadNextPage();
    }
  }, []);

  return { items, loadNextPage, isLoading, total, error } as const;
}


