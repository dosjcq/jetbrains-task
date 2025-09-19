import { useEffect, useMemo, useRef, useState } from 'react';

type UseVirtualGridOptions = {
  itemWidth: number;
  itemHeight: number;
  gapX?: number;
  gapY?: number;
  overscanRows?: number;
};

/**
 * useVirtualGrid
 *
 * Virtualizer for a CSS grid with fixed-size cards.
 * Assumes the WINDOW scrolls (not an inner scroll container).
 *
 * @param totalItems - Total number of items to render
 * @param containerRef - Reference to the container element
 * @param options - Options for the virtual grid
 * @param options.itemWidth - Card/column width in px (must match CSS width of a card)
 * @param options.itemHeight - Card height in px (must match CSS height of a card)
 * @param options.gapX - Horizontal gap fallback in px (used if CSS `column-gap` is not set)
 * @param options.gapY - Vertical gap fallback in px (used if CSS `row-gap` is not set)
 * @param options.overscanRows - Number of extra rows to render above and below the viewport
 * @returns Virtual grid dimensions and indices
 */
export function useVirtualGrid(
  totalItems: number,
  containerRef: React.RefObject<HTMLElement>,
  {
    itemWidth,
    itemHeight,
    gapX = 12,
    gapY = 12,
    overscanRows = 2,
  }: UseVirtualGridOptions,
) {
  // Number of columns currently fitting in the container
  const [columnCount, setColumnCount] = useState(1);
  // Current window scroll position and viewport height
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  // Absolute page Y-position of the container's top edge (updated on resize)
  const containerTopPageYRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Measure container top in page coordinates
    const computeContainerTop = () => {
      const rect = el.getBoundingClientRect();
      containerTopPageYRef.current = window.scrollY + rect.top;
    };

    // Measure how many columns fit into the container's *content* width
    const measureColumns = () => {
      const cs = getComputedStyle(el);

      // Use content width (clientWidth minus paddings) to match grid tracks
      const padX =
        parseFloat(cs.paddingLeft || '0') + parseFloat(cs.paddingRight || '0');
      const contentWidth = el.clientWidth - padX;

      // Prefer actual CSS column-gap if present; fallback to provided gapX
      const gapXReal = parseFloat(cs.columnGap || '') || gapX;

      // Width of a single track: card + one inter-column gap
      const track = itemWidth + gapXReal;

      // Classic formula to fit N tracks into contentWidth
      const next = Math.max(1, Math.floor((contentWidth + gapXReal) / track));
      setColumnCount(next);
    };

    // Initial measurements
    setViewportHeight(window.innerHeight);
    setScrollY(window.scrollY);
    computeContainerTop();
    measureColumns();

    // Re-measure when the container's box changes (width/position)
    const ro = new ResizeObserver(() => {
      computeContainerTop();
      measureColumns();
    });
    ro.observe(el);

    // Window listeners
    const onScroll = () => setScrollY(window.scrollY);
    const onResize = () => {
      setViewportHeight(window.innerHeight);
      computeContainerTop();
      measureColumns();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [containerRef, itemWidth, gapX]);

  const { startIndex, endIndex, padTop, padBottom } = useMemo(() => {
    const el = containerRef.current;

    // Guard: nothing to render yet
    if (!el || totalItems <= 0 || columnCount <= 0) {
      return { startIndex: 0, endIndex: 0, padTop: 0, padBottom: 0 };
    }

    // Full row stride (card height + vertical gap)
    const rowStride = itemHeight + gapY;

    // Total number of rows needed to place all items
    const totalRows = Math.max(1, Math.ceil(totalItems / columnCount));

    // Current visible window in page coordinates
    const viewTop = scrollY;
    const viewBottom = scrollY + viewportHeight;

    // Convert to container-local coordinates (0 == container's top)
    const containerTop = containerTopPageYRef.current;
    const containerViewTop = Math.max(0, viewTop - containerTop);
    const containerViewBottom = Math.max(0, viewBottom - containerTop);

    // Determine first/last visible rows, expand by overscan
    let firstRow = Math.floor(containerViewTop / rowStride) - overscanRows;
    let lastRow = Math.ceil(containerViewBottom / rowStride) + overscanRows;

    firstRow = Math.max(0, firstRow);
    lastRow = Math.min(totalRows - 1, lastRow);

    // Convert rows to item indices [startIndex, endIndex)
    const start = firstRow * columnCount;
    const end = Math.min(totalItems, (lastRow + 1) * columnCount);

    // Spacer heights above and below the rendered slice
    const padTopPx = firstRow * rowStride;
    const visibleRows = Math.max(0, lastRow - firstRow + 1);
    const renderedH = visibleRows * rowStride;
    const totalH = totalRows * rowStride;
    const padBottomPx = Math.max(0, totalH - padTopPx - renderedH);

    return {
      startIndex: start,
      endIndex: end,
      padTop: padTopPx,
      padBottom: padBottomPx,
    };
  }, [
    columnCount,
    gapY,
    itemHeight,
    overscanRows,
    scrollY,
    viewportHeight,
    totalItems,
    containerRef,
  ]);

  return { columnCount, startIndex, endIndex, padTop, padBottom };
}
