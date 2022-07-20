import { AccessToken } from './model';

export function canRenew(token: AccessToken): token is Required<AccessToken> {
  return hasValidRefreshToken(token);
}

export function requiresRefresh(token: AccessToken): boolean {
  return isAccessTokenExpired(token);
}

function isAccessTokenExpired(token: AccessToken): boolean {
  return !!token.expiresAt && Date.now() > token.expiresAt;
}

function hasValidRefreshToken(token: AccessToken): boolean {
  return (
    !!token.refreshToken &&
    (!token.refreshTokenExpiresAt || Date.now() < token.refreshTokenExpiresAt)
  );
}
