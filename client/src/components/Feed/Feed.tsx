import { useCallback, useState } from 'react';

import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { usePokemonsFeed } from '../../hooks/usePokemonsFeed';
import { GEN_TAGS, type GenTag } from '../../lib/types';
import { CardItem } from '../CardItem';
import { TagButton } from '../TagButton';

import styles from './feed.module.scss';

export default function Feed() {
  const [filter, setFilter] = useState<GenTag | undefined>(undefined);
  const { items, isHasMore, error, loadNext, loadingRef } = usePokemonsFeed(filter);

  const onClickTag = useCallback((tag: GenTag) => {
    setFilter((cur) => (cur === tag ? undefined : tag));
  }, []);

  const infiniteScrollRef = useInfiniteScroll(
    async () => { await loadNext(); },
    { enabled: isHasMore && !loadingRef.current && !error, rootMargin: '400px' },
  );

  const empty = !loadingRef.current && items.length === 0 && !error;

  const toolbar =  (
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
  );

  const isEndOfFeed = !isHasMore && items.length > 0;

  return (
    <main className={styles.feedWrap}>
      <h1>Instapoke</h1>
      {toolbar}

      <section
        className={styles.grid}
      >
        {items.map((it) => <CardItem key={it.id} pokemon={it} onClickTag={onClickTag}/>)}
      </section>

      {loadingRef.current && <div className={styles.status}>Loading…</div>}
      {error &&
      <div className={styles.status_error}>
        <span>{error}</span>
        <button onClick={() => loadNext()}>
          Retry
        </button>
      </div>
      }
      {empty && <div className={styles.status}>No results</div>}
      {isEndOfFeed && <div className={styles.status_dim}>End of feed</div>}

      <div ref={infiniteScrollRef} style={{ height: 1 }} />
    </main>
  );
}
