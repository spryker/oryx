import { Transformer } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import { toMilliseconds } from '@spryker-oryx/utilities/typescript';
import { AccessToken } from '../../../../models';

export const TokenNormalizer = 'FES.TokenNormalizer*';

export function tokenAttributesNormalizer(source: any): AccessToken {
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

export const tokenNormalizer: Provider[] = [
  {
    provide: TokenNormalizer,
    useValue: tokenAttributesNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [TokenNormalizer]: Transformer<AccessToken>[];
  }
}
