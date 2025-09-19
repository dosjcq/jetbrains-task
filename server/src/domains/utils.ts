import { GEN_RANGES } from './constants';

export function generationTagFor(id: number): string {
  const generation = GEN_RANGES.find((genItem) => id >= genItem.start && id <= genItem.end);
  return generation ? generation.tag : 'gen-unknown';
}

export function rangeForTag(tag: string) {
  return GEN_RANGES.find((genItem) => genItem.tag === tag) ?? null;
}

export function idFromUrl(url: string) {
  const matchedId = url.match(/\/pokemon\/(\d+)\/*$/);
  return matchedId ? Number(matchedId[1]) : null;
}
