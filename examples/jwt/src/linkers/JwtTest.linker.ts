import { defineLinker } from '@tachyonjs/core';
import { useFastify } from '@tachyonjs/fastify';
import {
  AuthorizationHeaderToJWT,
  JWTValidationError,
  getJWTValidator,
  validateScopes,
} from '@tachyonjs/jwt';

export default defineLinker({
  name: 'JwtTest',
  install() {
    const fastify = useFastify();

    const jwtValidator = getJWTValidator({
      jwks_uri: '', // REPLACE WITH THE JWKS URL you use.
      verificationOptions: { algorithms: ['RS256'] },
    });

    fastify.get('/', async () =>
      [
        'This example exposes 3 routes:',
        '/basic - GET - checks for a bearer token in the authorization header, and returns the token with no decoding.',
        "/validate - GET - Validates that the JWT provided is valid. For the purposes of this, it's expecting an alg of none on the token.",
        '/scopes - GET - Validates that the JWT payload has a scopes array containing the scope "admin".',
      ].join('\n'),
    );

    /**
     * Example Basic Route, purely checks the authorization header for a bearer token.
     */
    fastify.get('/basic', async (request, response) => {
      try {
        const JWT = AuthorizationHeaderToJWT(request.headers.authorization);

        response.send(JWT);
      } catch (e) {
        if (e instanceof JWTValidationError) {
          // Invalid JWT
          response.code(401).send('Invalid JWT: ' + e.message);
        }
      }
    });

    /**
     * Checks the bearer token to see if it's ok.
     * Expects an algorithm of none on the token.
     */
    fastify.get('/validate', async (request, response) => {
      setTimeout(() => response.send('Timeout'), 1000);
      try {
        const JWT = AuthorizationHeaderToJWT(request.headers.authorization);

        console.log('JWT: ', JWT);
        const payload = await jwtValidator(JWT);

        response.send(payload);
      } catch (e) {
        if (e instanceof JWTValidationError) {
          // Invalid JWT
          response.code(401).send('Invalid JWT: ' + e.message);
        }
      }
    });

    /**
     * Checks the bearer token to see if it's ok.
     * Expects an algorithm of none on the token.
     * Expects the JWT to have a scopes array containing the scope "admin".
     */
    fastify.get('/scopes', async (request, response) => {
      setTimeout(() => response.send('Timeout'), 1000);

      try {
        const JWT = AuthorizationHeaderToJWT(request.headers.authorization);

        console.log('JWT: ', JWT);
        const payload = (await jwtValidator(JWT)).payload;

        //@ts-expect-error Typings for jwtPayload makes these unknown.
        const scopes = getScopes(payload.scopes ?? payload.scp);

        if (!scopes) throw new JWTValidationError('No Scopes');

        if (!Array.isArray(scopes)) {
          throw new JWTValidationError('Scopes is not an array');
        }

        const isValid = validateScopes(scopes, ['##EXAMPLE.SCOPE##']); // Replace with your required scopes

        if (!isValid)
          return response.code(401).send({
            $message: 'Invalid Scopes, Scope admin required',
            scopes,
          });

        response.send({
          $message: 'Valid JWT, Scopes are valid',
          scopes,
        });
      } catch (e) {
        if (e instanceof JWTValidationError) {
          // Invalid JWT
          response.code(401).send('Invalid JWT: ' + e.message);
        }
      }
    });
  },
});

export const getScopes = (scopes?: string | string[]) => {
  if (!scopes) return undefined;
  if (typeof scopes === 'string') return scopes.split(' ');
  return scopes;
};
