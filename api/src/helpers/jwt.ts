import { decode } from 'jsonwebtoken';
import formatAuthorisationToken from './formatAuthorisationToken';

let jwtStaleBefore = 0;

export const isJWTStale = (jwt: string) => {
  const decodedJWT = decode(formatAuthorisationToken(jwt)) as {
    iat: number;
  };
  const jwtIssuedAt = decodedJWT?.iat || 0;

  return jwtIssuedAt <= jwtStaleBefore;
};

export const makeJWTsStale = () => {
  jwtStaleBefore = Math.floor(Date.now() / 1000);
};
