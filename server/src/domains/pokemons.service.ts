import { GEN_RANGES } from './constants';
import { Page, PokemonItem } from './types';

function generationTagFor(id: number): string {
  const g = GEN_RANGES.find((r) => id >= r.start && id <= r.end);
  return g ? g.tag : 'gen-unknown';
}

function rangeForTag(tag: string) {
  return GEN_RANGES.find((r) => r.tag === tag) ?? null;
}

type PokeListJSON = {
  count: number;
  results: { name: string; url: string }[];
};

function idFromUrl(u: string) {
  const m = u.match(/\/pokemon\/(\d+)\/*$/);
  return m ? Number(m[1]) : null;
}

/**
 * Главная функция: одна страница списка.
 * Если searchGen задан, пагинируем внутри диапазона этого поколения,
 * иначе — глобально по всему списку.
 */
export async function generatePokemons(
  page: number,
  pageSize: number,
  searchGen?: string, // например "gen-iii"
): Promise<Page<PokemonItem>> {
  if (searchGen) {
    const range = rangeForTag(searchGen);
    if (!range) {
      return { items: [], page, pageSize, total: 0, hasNext: false };
    }

    const totalInRange = range.end - range.start + 1;
    const globalOffset = range.start - 1 + (page - 1) * pageSize;

    const r = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${globalOffset}`,
    );
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const list = (await r.json()) as PokeListJSON;

    const items = list.results
      .map((it) => {
        const id = idFromUrl(it.url);
        if (!id) return null;
        if (id < range.start || id > range.end) return null;
        return {
          id,
          name: it.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          tags: [searchGen],
        } as PokemonItem;
      })
      .filter(Boolean) as PokemonItem[];

    return {
      items,
      page,
      pageSize,
      total: totalInRange,
      hasNext: page * pageSize < totalInRange,
    };
  }

  const offset = (page - 1) * pageSize;
  const r = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`,
  );
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const list = (await r.json()) as PokeListJSON;

  const items: PokemonItem[] = list.results.map((it) => {
    const id = idFromUrl(it.url)!;
    return {
      id,
      name: it.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      tags: [generationTagFor(id)],
    };
  });

  return {
    items,
    page,
    pageSize,
    total: list.count,
    hasNext: offset + pageSize < list.count,
  };
}
