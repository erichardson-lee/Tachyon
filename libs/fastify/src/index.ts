import Fastify, { FastifyInstance } from 'fastify';
export { FastifyRequest, FastifyReply } from 'fastify';

const apps: Record<string, FastifyInstance> = {};

export const useFastify = (key = 'default'): FastifyInstance => {
  if (!apps[key]) {
    apps[key] = Fastify();
  }
  return apps[key];
};
