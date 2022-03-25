import { defineLinker } from '@tachyonjs/core';
import { useFastify } from '@tachyonjs/fastify';

export default defineLinker({
  name: 'greeter',
  install() {
    const fastify = useFastify();

    fastify.get('/', (request, reply) => {
      reply.send({ hello: 'world' });
    });

    fastify.get<{
      Params: { name: string };
    }>('/:name', async (request) => {
      const name = request.params.name;
      return { hello: name };
    });
  },
});
