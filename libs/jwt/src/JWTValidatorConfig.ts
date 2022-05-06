import { JWTVerifyOptions } from 'jose';

export type JWTValidatorConfig = {
  jwks_uri: string;
  verificationOptions: JWTVerifyOptions;
};
