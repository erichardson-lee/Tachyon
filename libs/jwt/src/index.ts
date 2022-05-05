import { JwtPayload, verify } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

import { JWTValidationError } from './JWTValidationError';
export { JWTValidationError } from './JWTValidationError';

import type { JWTValidateFunction } from './JWTValidateFunction';
export type { JWTValidateFunction } from './JWTValidateFunction';

import type { JWTValidatorConfig } from './JWTValidatorConfig';
export type { JWTValidatorConfig } from './JWTValidatorConfig';

export const JWT_REGEX = /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/;
const jwksClients: Record<string, JwksClient> = {};

/**
 * Returns a function that will validate a JWT,
 * takes a configuration object, and optionally a key.
 * @param cfg The configuration for the validator
 * @param key The key for the JWKSClient, defaults to 'default'
 * @returns A function that will validate a JWT
 */
export function getJWTValidator<DefaultPayload extends JwtPayload>(
  cfg: JWTValidatorConfig,
  key = 'default',
): JWTValidateFunction<DefaultPayload> {
  /**
   * This function will validate a JWT, and return the payload.
   * @param jwt The JWT to validate (Must be full form head.payload.signature)
   * @returns The payload of the JWT, decoded as an object.
   */
  return async <Payload extends DefaultPayload = DefaultPayload>(
    jwt: string,
  ): Promise<Payload> => {
    if (!jwksClients[key] && cfg.jwks_uri) {
      console.log('Creating JWKS Client');
      jwksClients[key] = new JwksClient({
        jwksUri: cfg.jwks_uri,
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        cacheMaxEntries: 10,
        cacheMaxAge: 24 * 60 * 60 * 1000, // 1 day
      });
    }

    console.log('JWT REGEX');
    if (!JWT_REGEX.test(jwt))
      throw new JWTValidationError('Invalid JWT Format (' + jwt + ')');

    const vPromise = new Promise<Payload>((res, rej) => {
      console.log('Verifying JWT');
      verify(
        jwt,
        (header, cb) => {
          if (!jwksClients[key]) {
            cb(new Error('JWKS Client not found'));
          }
          jwksClients[key].getSigningKey(header.kid, (err, key) => {
            if (err) cb(err);
            else if (!key) cb(new Error('Key not found'));
            else cb(null, key.getPublicKey());
          });
        },
        cfg.verificationOptions,
        (err, payload) => {
          if (err) rej(err);
          else res(payload as Payload);
        },
      );
    });

    return vPromise;
  };
}

/**
 * Simple Utility function to Remove the Bearer prefix from an Authorization header,
 * and check the resulting JWT is in the correct format
 * @param header
 * @returns
 */
export function AuthorizationHeaderToJWT(authString?: string): string {
  if (!authString)
    throw new JWTValidationError('No Authorization Header Provided');

  const jwt: string = authString
    .trim()
    .replace(/^Bearer/i, '')
    .trim();

  if (!JWT_REGEX.test(jwt))
    throw new JWTValidationError('Invalid JWT Format (' + jwt + ')');

  return jwt;
}

/**
 * Simple Utility function to check that all the required scopes are present in the JWT
 * @param scopes The list of scopes to check
 * @param requiredScopes The list of scopes that are required to be in the first list.
 * @returns true if all the required scopes are present in the JWT, false if not.
 */
export function validateScopes(
  scopes: string[],
  requiredScopes: string[],
): boolean {
  return requiredScopes.every((scope) => scopes.includes(scope));
}
