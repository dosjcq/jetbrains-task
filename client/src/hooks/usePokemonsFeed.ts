import { useCallback, useEffect, useRef, useState } from 'react';

import { PAGE_SIZE } from '../constants/feedConstants';
import type { ErrorResponse, GenTag, PokemonItem } from '../lib/types';
import { useLazyGetPokemonsQuery } from '../store/pokemonsApi';

export function usePokemonsFeed(search?: GenTag) {
  const [items, setItems] = useState<PokemonItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isHasMore, setIsHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [trigger] = useLazyGetPokemonsQuery();

  const loadingRef = useRef(false);
  const currentPageRef = useRef(1);

  const reset = useCallback(() => {
    setItems([]);
    setIsHasMore(true);
    setError(null);
    currentPageRef.current = 1;
    setCurrentPage(1);
  }, []);

  const loadNext = useCallback(async () => {
    if (loadingRef.current || !isHasMore) return;

    loadingRef.current = true;
    setError(null);

    const currentPage = currentPageRef.current;

    try {
      const res = await trigger({ page: currentPage, pageSize: PAGE_SIZE, search }, true).unwrap();

      setItems((prev) => [...prev, ...res.items]);

      setIsHasMore(res.hasNext);
      currentPageRef.current = currentPage + 1;
      setCurrentPage(currentPageRef.current);
    } catch (e: unknown) {
      setError((e as ErrorResponse)?.data.message ?? 'Load error');
    } finally {
      loadingRef.current = false;
    }
  }, [isHasMore, search, trigger]);

  useEffect(() => {
    reset();

    const run = async () => {
      await loadNext();
    };
    run();

  }, [search, reset, loadNext]);

  return { items, isHasMore, error, loadNext, reset, loadingRef, currentPage };
}
