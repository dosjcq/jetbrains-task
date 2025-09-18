export type PokemonItem = {
  id: number;
  name: string;
  image: string;
  tags: string[];
};

export type Page<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
};
