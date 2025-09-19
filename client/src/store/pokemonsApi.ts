import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { GenTag,Page, PokemonItem  } from '../lib/types';

export const pokemonsApi = createApi({
  reducerPath: 'pokemonsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  keepUnusedDataFor: 60,
  endpoints: (build) => ({
    getPokemons:
      build.query<Page<PokemonItem>, { page: number; pageSize?: number; search?: GenTag }>({
        query: ({ page, pageSize = 50, search }) => ({
          url: 'images',
          params: { page, pageSize, ...(search ? { search } : {}) },
        }),
      }),
  }),
});

export const {
  useGetPokemonsQuery,
  useLazyGetPokemonsQuery,
} = pokemonsApi;
