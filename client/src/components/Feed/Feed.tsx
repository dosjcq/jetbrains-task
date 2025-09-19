import { type RefObject,useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { GAP, ITEM_HEIGHT, ITEM_WIDTH } from '@/constants/gridContants';

import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { usePokemonsFeed } from '../../hooks/usePokemonsFeed';
import { useVirtualGrid } from '../../hooks/useVirtualGrid'; // ← добавили
import { GEN_TAGS, type GenTag } from '../../lib/types';
import { CardItem } from '../CardItem/CardItem';
import { TagButton } from '../TagButton/TagButton';

import styles from './feed.module.scss';

export default function Feed() {
  const [filter, setFilter] = useState<GenTag | undefined>(undefined);
  const { items, isHasMore, error, loadNext, reset, loadingRef } = usePokemonsFeed(filter);

  const initOnceRef = useRef<Record<string, boolean>>({});
  const filterKey = filter ?? 'all';

  useEffect(() =>{
    initOnceRef.current[filterKey] = false;
    reset();
  }, [filterKey, reset]);

  useEffect(() => {
    if (initOnceRef.current[filterKey]) return;
    initOnceRef.current[filterKey] = true;
    void loadNext();
  }, [filterKey, loadNext]);

  const onClickTag = useCallback((tag: GenTag) => {
    setFilter((cur) => (cur === tag ? undefined : tag));
  }, []);

  const gridRef = useRef<HTMLElement | null>(null);

  const virtualGrid = useVirtualGrid(items.length, gridRef as RefObject<HTMLElement>, {
    itemWidth: ITEM_WIDTH,
    itemHeight: ITEM_HEIGHT,
    gapX: GAP,
    gapY: GAP,
    overscanRows: 2,
  });

  const infiniteScrollRef = useInfiniteScroll(
    async () => { await loadNext(); },
    { enabled: isHasMore && !loadingRef.current && !error, rootMargin: '600px' },
  );

  const empty = !loadingRef.current && items.length === 0 && !error;

  const toolbar = useMemo(() => (
    <div className={styles.toolbar}>
      <div className={styles.tagsRow}>
        {GEN_TAGS.map(
          (t) => <TagButton key={t} tag={t} active={filter === t} onClick={onClickTag} />,
        )}
      </div>
      {filter &&
        <button className={styles.clear} onClick={() => setFilter(undefined)}>
          Clear filter
        </button>
      }
    </div>
  ), [filter, onClickTag]);

  const unVirtualizedItems = items.slice(virtualGrid.startIndex, virtualGrid.endIndex);

  return (
    <main className={styles.feedWrap}>
      <h1>Instapoke</h1>
      {toolbar}

      <div style={{ height: virtualGrid.padTop }} />

      <section
        className={styles.grid}
        ref={(el) => {
          if (el) gridRef.current = el;
        }}
        style={{
          gridTemplateColumns: `repeat(${virtualGrid.columnCount}, minmax(0, 1fr))`,
        }}
      >
        {unVirtualizedItems.map((it) => <CardItem key={it.id} item={it} onClickTag={onClickTag}/>)}
      </section>

      <div style={{ height: virtualGrid.padBottom }} />

      {loadingRef.current && <div className={styles.status}>Loading…</div>}
      {error &&
      <div className={styles.statusError}>
        <span>{error}</span>
        <button onClick={() => loadNext()}>
          Retry
        </button>
      </div>
      }
      {empty && <div className={styles.status}>No results</div>}
      {!isHasMore && items.length > 0 && <div className={styles.statusDim}>End of feed</div>}

      <div ref={infiniteScrollRef} style={{ height: 1 }} />
    </main>
  );
}
