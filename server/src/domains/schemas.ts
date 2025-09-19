import { z } from 'zod';
import { GEN_ENUM } from './constants';

export const GetPokemonsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
  search: z.enum(GEN_ENUM).optional(),
});

export type GetPokemonsQuery = z.infer<typeof GetPokemonsQuery>;

export const GetPokemonsSchema = {
  description: 'Paginated feed from PokeAPI with optional generation filter (search=gen-i ... gen-ix).',
  tags: ['images'],
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      pageSize: { type: 'integer', minimum: 1, maximum: 200, default: 50 },
      search: { type: 'string', enum: [...GEN_ENUM], description: 'generation tag' },
    },
  },
  response: {
    200: {
      type: 'object',
      required: ['items','page','pageSize','total','hasNext'],
      properties: {
        items: { type: 'array', items: {
          type: 'object',
          required: ['id','name','image','tags'],
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            image: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
          },
        } },
        page: { type: 'integer' },
        pageSize: { type: 'integer' },
        total: { type: 'integer' },
        hasNext: { type: 'boolean' },
      },
    },
  },
};
