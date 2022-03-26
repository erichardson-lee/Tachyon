import type { FastifyInstance } from 'fastify/types/instance';

import supertokens from 'supertokens-node';

import type { TypeInput as SuperTokensOptions } from 'supertokens-node/lib/build/types';
export type { TypeInput as SuperTokensOptions } from 'supertokens-node/lib/build/types';

import { useFastify } from '@tachyonjs/fastify';

import cors, { FastifyCorsOptions } from 'fastify-cors';
import formBodyPlugin, { FormBodyPluginOptions } from 'fastify-formbody';

/**
 * Install the super tokens plugin.
 * @param opts the Options to use for supertokens.
 * @param fastify Fastify instance to install onto, accepts instance name or instance itself.
 * @param corsOpts the options to use for fastify-cors, used to override the default options from supertokens.
 * @param formbodyOpts the options to use for fastify-formbody, used to override the default options from supertokens.
 * @returns A function that should be called AFTER all routes have been initialised in the program.
 */
export async function InstallSuperTokens(
  opts: SuperTokensOptions,
  fastify: FastifyInstance | string = 'default',
  corsOpts?: Partial<FastifyCorsOptions>,
  formbodyOpts?: Partial<FormBodyPluginOptions>,
): Promise<() => Promise<void>> {
  const fst = typeof fastify === 'string' ? useFastify(fastify) : fastify;

  const { plugin: STPlugin, errorHandler } = await import('supertokens-node/framework/fastify')


  supertokens.init(opts);

  fst.register(cors, {
    ...corsOpts,
    origin: corsOpts?.origin ?? '*',
    allowedHeaders: corsOpts?.allowedHeaders ?? [
      'Content-Type',
      ...supertokens.getAllCORSHeaders(),
    ],
    credentials: corsOpts?.credentials ?? true,
  });

  await fst.register(formBodyPlugin, formbodyOpts);
  await fst.register(STPlugin);

  return async () => {
    fst.setErrorHandler(errorHandler());
  };
}
