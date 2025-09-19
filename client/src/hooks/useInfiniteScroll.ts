import { useCallback, useEffect, useRef } from 'react';

type InfiniteScrollOptions = {
  rootMargin?: string;
  enabled?: boolean;
  cooldownMs?: number;
  threshold?: number;
};

/**
 * useInfiniteScroll
 *
 * IntersectionObserver-based infinite scroll hook with:
 * - callback ref (attaches as soon as the DOM node mounts);
 * - single-shot triggering (unobserve → load → reobserve);
 * - internal loading guard and cooldown;
 * - clean re-arming on option changes.
 *
 * @param callback  Async loader invoked when the infiniteScroll element intersects the viewport.
 * @param options   Behavior settings (rootMargin, enabled, cooldownMs, threshold).
 * @returns         A callback ref to assign to the infiniteScroll element
 */
export function useInfiniteScroll(
  callback: () => Promise<void> | void,
  {
    rootMargin = '400px',
    enabled = true,
    cooldownMs = 150,
    threshold = 0,
  }: InfiniteScrollOptions = {},
) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isLoadingRef = useRef(false);

  const disconnectObserver = useCallback(() => {
    observerRef.current?.disconnect();
    observerRef.current = null;
  }, []);

  const setupObserver = useCallback(() => {
    const el = targetRef.current;
    if (!el || !enabled) return;

    disconnectObserver();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isLoadingRef.current || !enabled) return;
        if (!entries.some((e) => e.isIntersecting)) return;

        isLoadingRef.current = true;
        observerRef.current?.unobserve(el);

        Promise.resolve(callback())
          .catch((err) => {
            console.error('useInfiniteScroll load error:', err);
          })
          .finally(() => {
            setTimeout(() => {
              isLoadingRef.current = false;
              if (enabled && targetRef.current) {
                observerRef.current?.observe(targetRef.current);
              }
            }, cooldownMs);
          });
      },
      { root: null, rootMargin, threshold },
    );

    observerRef.current.observe(el);
  }, [callback, enabled, rootMargin, threshold, cooldownMs, disconnectObserver]);

  const infiniteScrollRef = useCallback((node: HTMLDivElement | null) => {
    targetRef.current = node;
    if (node) setupObserver();
    else disconnectObserver();
  }, [setupObserver, disconnectObserver]);

  useEffect(() => {
    if (targetRef.current) setupObserver();
    return disconnectObserver;
  }, [setupObserver, disconnectObserver]);

  return infiniteScrollRef;
}
