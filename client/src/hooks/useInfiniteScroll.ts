import { useEffect, useRef } from 'react';

type Options = { rootMargin?: string; enabled?: boolean; cooldownMs?: number };

/**
 * useInfiniteScroll
 *
 * A simple React hook for infinite scrolling.
 * Returns a ref (infiniteScrollRef) that you attach to a bottom element.
 * When this element enters the viewport, the callback is triggered to load more items.
 *
 * @param callback - Function to call when more content should load
 * @param options - { rootMargin, enabled, cooldownMs }
 * @returns infiniteScrollRef - attach this to a div at the end of your list

 */
export function useInfiniteScroll(
  callback: () => Promise<void> | void,
  { rootMargin = '400px', enabled = true, cooldownMs = 150 }: Options = {},
) {
  const infiniteScrollRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const el = infiniteScrollRef.current;
    if (!enabled || !el) return;

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (!enabled || isLoadingRef.current) return;
      if (entries.some((e) => e.isIntersecting)) {
        isLoadingRef.current = true;
        Promise.resolve(callback())
          .catch(() => {
            console.error('Error loading more items');
          })
          .finally(() => {
            setTimeout(() => { isLoadingRef.current = false; }, cooldownMs);
          });
      }
    }, { rootMargin });

    intersectionObserver.observe(el);
    return () => {
      intersectionObserver.disconnect();
    };
  }, [callback, enabled, rootMargin, cooldownMs]);

  return infiniteScrollRef;
}
