import { useCallback, useEffect, useRef, useState } from 'react';

import { PAGE_SIZE } from '../constants/feedConstants';
import type { ErrorResponse, GenTag, PokemonItem } from '../lib/types';
import { useLazyGetPokemonsQuery } from '../store/pokemonsApi';

type FeedState = {
  items: PokemonItem[];
  page: number;
  hasMore: boolean;
  error: string | null;
};

export function usePokemonsFeed(search?: GenTag) {
  const [state, setState] = useState<FeedState>({
    items: [],
    page: 1,
    hasMore: true,
    error: null,
  });

  const [trigger] = useLazyGetPokemonsQuery();

  const isLoadingRef = useRef(false);
  const pageRef = useRef(1);
  const lastRequestIdRef = useRef(0);

  const reset = useCallback(() => {
    setState({ items: [], page: 1, hasMore: true, error: null });
    pageRef.current = 1;
  }, []);

  useEffect(() => {
    reset();

    const fetchFirstPage = async () => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      const reqId = ++lastRequestIdRef.current;

      try {
        const res = (await trigger({ page: 1, pageSize: PAGE_SIZE, search }).unwrap());
        if (reqId !== lastRequestIdRef.current) return;

        setState({
          items: res.items,
          page: res.hasNext ? 2 : 1,
          hasMore: res.hasNext,
          error: null,
        });
        pageRef.current = res.hasNext ? 2 : 1;
      } catch (e: unknown) {
        if (reqId === lastRequestIdRef.current) {
          setState((s) => ({ ...s, error: (e as ErrorResponse)?.data.message ?? 'Load error' }));
        }
      } finally {
        isLoadingRef.current = false;
      }
    };

    fetchFirstPage();
  }, [search, reset, trigger]);

  const fetchNext = useCallback(async () => {
    if (isLoadingRef.current || !state.hasMore) return;

    isLoadingRef.current = true;
    setState((s) => ({ ...s, error: null }));
    const reqId = ++lastRequestIdRef.current;
    const page = pageRef.current;

    try {
      const res = (await trigger({ page, pageSize: PAGE_SIZE, search }).unwrap());
      if (reqId !== lastRequestIdRef.current) return;

      setState((s) => ({
        items: [...s.items, ...res.items],
        page: page + 1,
        hasMore: res.hasNext,
        error: null,
      }));
      pageRef.current = page + 1;

      if (res.items.length === 0) {
        setState((s) => ({ ...s, hasMore: false }));
      }
    } catch (e: unknown) {
      if (reqId === lastRequestIdRef.current) {
        setState((s) => ({ ...s, error: (e as ErrorResponse)?.data.message ?? 'Load error' }));
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [state.hasMore, search, trigger]);

  return {
    items: state.items,
    isHasMore: state.hasMore,
    error: state.error,
    loadNext: fetchNext,
    reset,
    loadingRef: isLoadingRef,
    currentPage: state.page,
  };
}
