import { createRemoteJWKSet, JWTVerifyResult, jwtVerify } from 'jose';

import { JWTValidationError } from './JWTValidationError';
export { JWTValidationError } from './JWTValidationError';

import type { JWTValidateFunction } from './JWTValidateFunction';
export type { JWTValidateFunction } from './JWTValidateFunction';

import type { JWTValidatorConfig } from './JWTValidatorConfig';
export type { JWTValidatorConfig } from './JWTValidatorConfig';

export const JWT_REGEX = /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/;

/**
 * Returns a function that will validate a JWT,
 * takes a configuration object, and optionally a key.
 * @param cfg The configuration for the validator
 * @returns A function that will validate a JWT
 */
export function getJWTValidator(cfg: JWTValidatorConfig): JWTValidateFunction {
  const JWKS = createRemoteJWKSet(new URL(cfg.jwks_uri));

  /**
   * This function will validate a JWT, and return the payload.
   * @param jwt The JWT to validate (Must be full form head.payload.signature)
   * @returns The payload of the JWT, decoded as an object.
   */
  return async (jwt: string): Promise<JWTVerifyResult> => {
    if (!JWT_REGEX.test(jwt))
      throw new JWTValidationError('Invalid JWT Format (' + jwt + ')');

    return jwtVerify(jwt, JWKS, cfg.verificationOptions);
  };
}

/**
 * Simple Utility function to Remove the Bearer prefix from an Authorization header,
 * and check the resulting JWT is in the correct format
 * @param authString The Authorization header string
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
