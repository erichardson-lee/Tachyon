import Fastify, { FastifyInstance } from 'fastify';
export { FastifyRequest, FastifyReply } from 'fastify';

const apps: Record<string, FastifyInstance> = {};

/**
 * Returns an instance of Fastify to the user, optionally taking a key.
 * @param key The named instance of Fastify to return
 * @returns An instance of Fastify
 */
export const useFastify = (key = 'default'): FastifyInstance => {
  if (!apps[key]) {
    apps[key] = Fastify();
  }
  return apps[key];
};
