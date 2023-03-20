export interface OauthResponseSuccess extends Record<string, unknown> {
  access_token: string;
  token_type: OauthResponseTokenType;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

/** Supported Oauth token types */
export type OauthResponseTokenType = 'bearer';

export interface OauthResponseError extends Record<string, unknown> {
  error: string;
  error_description?: string;
  error_uri?: string;
}
