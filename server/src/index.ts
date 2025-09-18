import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { ENV } from './env';
import { imagesRoutes } from './domains/pokemons.routes';

const app = Fastify({
  logger:
    ENV.NODE_ENV === 'development'
      ? { transport: { target: 'pino-pretty', options: { colorize: true, singleLine: true } } }
      : true,
});

await app.register(cors, { origin: ENV.CORS_ORIGIN });

await app.register(swagger, {
  openapi: {
    info: { title: 'Instapoke API', version: '1.0.0' },
    servers: [{ url: `http://localhost:${ENV.PORT}` }],
  },
});

await app.register(swaggerUI, { routePrefix: '/docs', uiConfig: { docExpansion: 'list' } });

await app.register(imagesRoutes, { prefix: '/api' });

app.get('/health', async () => ({ ok: true, env: ENV.NODE_ENV }));

app.setNotFoundHandler((req, reply) => {
  reply.code(404).send({ message: 'Not Found', path: req.url });
});

app.setErrorHandler((err, req, reply) => {
  req.log.error({ err }, 'Unhandled error');
  const code = (err as { statusCode?: number }).statusCode ?? 500;
  reply.code(code).send({ message: err.message ?? 'Internal Server Error' });
});

try {
  await app.listen({ port: ENV.PORT, host: '0.0.0.0' });
  app.log.info(`Server  listening on http://localhost:${ENV.PORT}`);
  app.log.info(`Docs UI at        http://localhost:${ENV.PORT}/docs`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
