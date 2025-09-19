import type { FastifyInstance } from 'fastify';
import { generatePokemons } from './pokemons.service.js';
import { Page, PokemonItem } from './types.js';
import { GetPokemonsQuery, GetPokemonsSchema } from './schemas.js';

export async function imagesRoutes(app: FastifyInstance) {
  app.get<{ Reply: Page<PokemonItem> }>(
    '/images',
    {
      schema: GetPokemonsSchema,
    },
    async (req, reply) => {
      const { page, pageSize, search } = GetPokemonsQuery.parse(req.query);
      const data = await generatePokemons(page, pageSize, search);
      return reply.send(data);
    },
  );
}
