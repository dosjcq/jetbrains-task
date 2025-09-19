import { type GenTag } from '@/lib/types';

import styles from './tagButton.module.scss';

interface TagButtonProps {
  tag: GenTag;
  active: boolean;
  onClick: (t: GenTag) => void;
}

export function TagButton(
  { tag, active, onClick }: TagButtonProps,
) {
  return (
    <button
      className={`${styles.tag} ${active ? styles.active : ''}`}
      onClick={() => onClick(tag)}
      aria-pressed={active}
    >
      #{tag}
    </button>
  );
}
