export type PokemonItem = {
  id: number;
  name: string;
  image: string;
  tags: GenTag[];
};

export type Page<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
};

export const GEN_TAGS = [
  'gen-i','gen-ii','gen-iii','gen-iv','gen-v','gen-vi','gen-vii','gen-viii','gen-ix',
] as const;
export type GenTag = typeof GEN_TAGS[number];

export type ErrorResponse = {
  status: number;
  data: {
    statusCode: number;
    code: string;
    error: string;
    message: string;
  };
};
