export interface AccessToken {
  accessToken: string;
  expiresAt?: number;
  refreshToken?: string;
  /** refresh token expiration in seconds */
  refreshTokenExpiresAt?: number;
  tokenType?: string;
}

/**
 * Used during requests for access tokens to support username password OAuth flow.
 */
export interface TokenExchangeParams {
  username?: string;
  password?: string;
}
