import { JWTVerifyResult } from 'jose';

export type JWTValidateFunction = (jwt: string) => Promise<JWTVerifyResult>;
