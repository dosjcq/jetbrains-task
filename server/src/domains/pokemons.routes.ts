import type { FastifyInstance } from 'fastify';
import { generatePokemons } from './pokemons.service.js';
import { Page, PokemonItem } from './types.js';
import { GEN_ENUM } from './constants.js';
import { GetPokemonsQuery } from './schemas.js';

export async function imagesRoutes(app: FastifyInstance) {
  app.get<{ Reply: Page<PokemonItem> }>(
    '/images',
    {
      schema: {
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
      },
    },
    async (req, reply) => {
      const { page, pageSize, search } = GetPokemonsQuery.parse(req.query);
      const data = await generatePokemons(page, pageSize, search);
      return reply.send(data);
    },
  );
}
