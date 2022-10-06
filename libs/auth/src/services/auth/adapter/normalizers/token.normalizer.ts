import { Transformer } from '@spryker-oryx/core';
import { toMilliseconds } from '@spryker-oryx/typescript-utils';
import { AccessToken } from '../../../../models';

export const TokenNormalizers = 'FES.TokenNormalizers';

export function tokenNormalizer(source: any): AccessToken {
  const token: AccessToken = {
    accessToken: source.access_token,
  };
  if (source.token_type) {
    token.tokenType = source.token_type;
  }
  if (source.expires_in) {
    token.expiresAt = Date.now() + toMilliseconds(source.expires_in);
  }
  if (source.refresh_token) {
    token.refreshToken = source.refresh_token;
    if (source.refreshTokenExpiresAt) {
      token.refreshTokenExpiresAt = toMilliseconds(
        source.refreshTokenExpiresAt
      );
    }
  }
  return token;
}

export const tokenNormalizers = [tokenNormalizer];

declare global {
  interface InjectionTokensContractMap {
    [TokenNormalizers]: Transformer<AccessToken>[];
  }
}
