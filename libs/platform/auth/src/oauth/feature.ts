import { AppFeature, HttpInterceptor } from '@spryker-oryx/core';
import { Provider, inject } from '@spryker-oryx/di';
import {
  AuthService,
  AuthTokenInterceptorConfig,
  AuthTokenService,
} from '../services';
import { OauthTokenInterceptor } from './oauth-token.interceptor';
import { OauthService, OauthServiceConfig } from './oauth.service';
import {
  DefaultOauthProviderFactoryService,
  OauthProviderFactoryService,
} from './provider-factory.service';
import { defaultOauthProviders } from './providers';

export class OauthFeature implements AppFeature {
  providers;

  constructor(config: OauthFeatureConfig | (() => OauthFeatureConfig)) {
    const configFactory = typeof config === 'function' ? config : () => config;
    this.providers = this.getProviders(configFactory);
  }

  protected getProviders(configFactory: () => OauthFeatureConfig): Provider[] {
    return [
      { provide: OauthService, useClass: OauthService },
      { provide: OauthServiceConfig, useFactory: () => configFactory() },
      { provide: AuthService, useFactory: () => inject(OauthService) },
      { provide: AuthTokenService, useFactory: () => inject(OauthService) },
      { provide: HttpInterceptor, useClass: OauthTokenInterceptor },
      {
        provide: AuthTokenInterceptorConfig,
        useFactory: () => configFactory().tokenInterceptor,
      },
      {
        provide: OauthProviderFactoryService,
        useClass: DefaultOauthProviderFactoryService,
      },
      ...defaultOauthProviders,
    ];
  }
}

export interface OauthFeatureConfig extends OauthServiceConfig {
  tokenInterceptor?: AuthTokenInterceptorConfig;
}
