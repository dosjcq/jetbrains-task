import { Page, PokeListJSON, PokemonItem } from './types';
import { generationTagFor, idFromUrl, rangeForTag } from './utils';

/**
 * Main function: one page of the list.
 * If searchGen is specified, paginate within the range of that generation,
 * otherwise — globally across the entire list.
 */
export async function generatePokemons(
  page: number,
  pageSize: number,
  searchGen?: string,
): Promise<Page<PokemonItem>> {
  if (searchGen) {
    const range = rangeForTag(searchGen);
    if (!range) {
      return { items: [], page, pageSize, total: 0, hasNext: false };
    }

    const totalInRange = range.end - range.start + 1;
    const globalOffset = range.start - 1 + (page - 1) * pageSize;

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${globalOffset}`,
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const list = (await response.json()) as PokeListJSON;

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
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`,
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const list = (await response.json()) as PokeListJSON;

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
