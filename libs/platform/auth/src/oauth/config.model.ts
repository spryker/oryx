declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface OauthProvidersMap {
    // [grantType: string]: {
    //   provider: OauthProvider;
    //   config: OauthProviderConfigBase;
    // };
  }
}

export type OauthGrantType = keyof OauthProvidersMap;

export type InferOauthConfig<T> = T extends OauthGrantType
  ? OauthProvidersMap[T]['config']
  : OauthProviderConfigBase;

export type OauthProviderConfig =
  OauthProvidersMap[keyof OauthProvidersMap]['config'];

export interface OauthProviderConfigBase extends OauthProviderRequest {
  id: string;
  clientId: string;
  grantType: OauthGrantType;
}

export interface OauthProviderRequest extends Record<string, unknown> {
  scope?: string;
}
