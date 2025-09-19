import type { GenTag } from '@/lib/types';

import styles from './tagButton.module.scss';

export function TagButton(
  { tag, active, onClick }: { tag: GenTag; active: boolean; onClick: (t: GenTag) => void },
) {
  return (
    <button className={`${styles.tag} ${active ? styles.active : ''}`} onClick={() => onClick(tag)} aria-pressed={active}>
      #{tag}
    </button>
  );
}
