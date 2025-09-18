import { z } from 'zod';
import { GEN_ENUM } from './constants';

export const GetPokemonsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
  search: z.enum(GEN_ENUM).optional(),
});

export type GetPokemonsQuery = z.infer<typeof GetPokemonsQuery>;
