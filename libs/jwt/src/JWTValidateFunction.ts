import { JwtPayload } from 'jsonwebtoken';

export type JWTValidateFunction<DefaultPayload extends JwtPayload> = <
  Payload extends DefaultPayload,
>(
  jwt: string,
) => Promise<Payload>;
