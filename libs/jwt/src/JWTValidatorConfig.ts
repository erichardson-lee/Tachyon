import { OpenIdConfig } from './OpenIdConfig';
import { VerifyOptions } from 'jsonwebtoken';

export interface JWTValidatorConfig {
  openIdConfig: OpenIdConfig;
  verificationOptions: VerifyOptions;
}
