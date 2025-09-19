import { useCallback, useEffect, useMemo, useState } from 'react';

import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { usePokemonsFeed } from '../../hooks/usePokemonsFeed';
import { GEN_TAGS, type GenTag } from '../../lib/types';
import { CardItem } from '../CardItem';
import { TagButton } from '../TagButton';

import styles from './feed.module.scss';

export default function Feed() {
  const [activeTag, setActiveTag] = useState<GenTag | undefined>(undefined);
  const { items, isHasMore: hasMore, error, loadNext, loadingRef } = usePokemonsFeed(activeTag);

  const handleTagClick = useCallback((tag: GenTag) => {
    setActiveTag((cur) => {
      const next = cur === tag ? undefined : tag;
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
      return next;
    });
  }, []);

  const infiniteScrollRef = useInfiniteScroll(
    async () => { await loadNext(); },
    { enabled: hasMore && !error, rootMargin: '400px', threshold: 0, cooldownMs: 150 },
  );

  const isInitialLoading = loadingRef.current && items.length === 0;
  const isEmpty = !loadingRef.current && items.length === 0 && !error;
  const isEnd = !hasMore && items.length > 0;

  useEffect(() => {
    if (items.length === 0 && !loadingRef.current && !error) {
      loadNext();
    }
  }, [activeTag]);

  const toolbar = useMemo(() => (
    <div className={styles.toolbar}>
      <div className={styles.tagsRow}>
        {GEN_TAGS.map((t) => (
          <TagButton key={t} tag={t} active={activeTag === t} onClick={handleTagClick} />
        ))}
      </div>
      {activeTag && (
        <button
          className={styles.clear}
          onClick={() => {
            setActiveTag(undefined);
            requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
          }}
        >
          Clear filter
        </button>
      )}
    </div>
  ), [activeTag, handleTagClick]);

  return (
    <main className={styles.feedWrap}>
      <h1>Instapoke</h1>
      {toolbar}

      <section className={styles.grid}>
        {items.map((it) => (
          <CardItem key={it.id} pokemon={it} onClickTag={handleTagClick} />
        ))}
      </section>

      {isInitialLoading && <div className={styles.status}>Loading…</div>}
      {error && (
        <div className={styles.status_error}>
          <span>{error}</span>
          <button onClick={() => loadNext()}>Retry</button>
        </div>
      )}
      {isEmpty && <div className={styles.status}>No results</div>}
      {isEnd && <div className={styles.status_dim}>End of feed</div>}

      <div style={{ height: 24 }} />
      <div ref={infiniteScrollRef} style={{ height: 1 }} />
    </main>
  );
}
