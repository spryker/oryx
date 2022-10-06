export interface AccessToken {
  accessToken: string;
  expiresAt?: number;
  refreshToken?: string;
  /** refresh token expiration in seconds */
  refreshTokenExpiresAt?: number;
  tokenType?: string;
}

export interface JWTTokenPayload {
  aud: string;
  exp: number;
  iat: number;
  jti: string;
  nbf: number;
  scopes: string[];
  sub: {
    customer_reference: string;
    id_agent: unknown;
    id_company_user: string;
    id_customer: number;
    permissions: unknown[];
  };
}
