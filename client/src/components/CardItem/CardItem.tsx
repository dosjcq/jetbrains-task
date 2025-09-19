import type { GenTag, PokemonItem } from '@/lib/types';

import styles from './cardItem.module.scss';
export function CardItem(
  { item, onClickTag }: { item: PokemonItem, onClickTag: (tag: GenTag) => void },
) {
  return (
    <figure className={styles.card} aria-label={item.name}>
      <img src={item.image} alt={item.name} width={96} height={96} loading="lazy" decoding="async" />
      <figcaption className={styles.meta}>
        <span className={styles.name}>{item.name}</span>
        <div className={styles.tags}>
          {item.tags.map((t) =>
            <span className={styles.chip} key={t} onClick={() => onClickTag(t)}>{t}</span>,
          )}
        </div>
      </figcaption>
    </figure>
  );
}
