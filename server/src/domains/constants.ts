export const GEN_ENUM = [
  'gen-i','gen-ii','gen-iii','gen-iv','gen-v','gen-vi','gen-vii','gen-viii','gen-ix',
] as const;

export const GEN_RANGES = [
  { tag: 'gen-i', start: 1, end: 151 },
  { tag: 'gen-ii', start: 152, end: 251 },
  { tag: 'gen-iii', start: 252, end: 386 },
  { tag: 'gen-iv', start: 387, end: 493 },
  { tag: 'gen-v', start: 494, end: 649 },
  { tag: 'gen-vi', start: 650, end: 721 },
  { tag: 'gen-vii', start: 722, end: 809 },
  { tag: 'gen-viii', start: 810, end: 905 },
  { tag: 'gen-ix', start: 906, end: 1025 }, // актуально на сейчас; легко расширить
] as const;
