import { VerifyOptions } from 'jsonwebtoken';

export interface JWTValidatorConfig {
  jwks_uri: string;
  verificationOptions: VerifyOptions;
}
