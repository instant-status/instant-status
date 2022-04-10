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
  // 10 second grace period is allowed, to account for two things:
  //   - new JWTs being generated alongside staleness requests
  //   - delay before user is provided with fresh JWT from API response
  const gracePeriodSeconds = 10;
  const newJwtStaleBefore = Math.floor(Date.now() / 1000 - gracePeriodSeconds);
  setTimeout(() => {
    jwtStaleBefore = newJwtStaleBefore;
  }, 1000 * gracePeriodSeconds);
};
