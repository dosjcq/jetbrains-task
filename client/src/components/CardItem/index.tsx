import type { GenTag, PokemonItem } from '@/lib/types';

import styles from './cardItem.module.scss';

interface CardItemProps {
  pokemon: PokemonItem;
  onClickTag: (tag: GenTag) => void;
}

export function CardItem(
  { pokemon, onClickTag }: CardItemProps,
) {
  const { name, image, tags } = pokemon;

  return (
    <figure className={styles.card} aria-label={name}>
      <img className={styles.cardImg} src={image} alt={name} loading="lazy" decoding="async" />
      <figcaption className={styles.meta}>
        <span className={styles.name}>{name}</span>
        <div className={styles.tags}>
          {tags.map((tag) =>
            <span className={styles.chip} key={tag} onClick={() => onClickTag(tag)}>{tag}</span>,
          )}
        </div>
      </figcaption>
    </figure>
  );
}
